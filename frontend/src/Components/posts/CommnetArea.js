import { Avatar, Button, ChakraProvider } from '@chakra-ui/react'
import { Box } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HomeContext } from '../../Context/HomeContext';
import Picker from "emoji-picker-react";
import { BsEmojiSmileFill } from "react-icons/bs";
import styled from "styled-components";
import { MentionsInput, Mention } from 'react-mentions'
import { getAllUsers } from '../../Redux/Actions/authActions';
import defaultStyle from './defaultStyle';
import defaultMentionStyle from './defaultMentionStyle';


export default function CommnetArea({ handleSubmit, handleCancel, post, hasCancelButton = false }) {
    const [comment, setComment] = useState("")
    const [username, setUsername] = useState("")
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false);
    const { t, replyId, socket } = useContext(HomeContext)
    const auth = useSelector(state => state.auth)
    const { users } = useSelector(state => state.users)
    const userMention = useSelector((state) => (username ? users?.find((u) => u?.username === username) : null));

    const handleNotification = (type) => {
        socket.emit("sendNotification", {
            sender: auth.user,
            receiver: userMention,
            postId: post._id,
            post: 'post',
            type,
        });
    };

    function fetchUsers(query, callback) {
        if (!query) return
        const Users = users.map(user => ({
            display: user.username,
            id: user._id
        }))
        const filteredUsers = Users.filter((user) => user.display.toLowerCase().includes(query) && user.id !== auth.user.id)
        callback(filteredUsers)
    }


    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    useEffect(() => {
        dispatch(getAllUsers())
    }, [])
    useEffect(() => {
        document.addEventListener("click", handleDocumentClick, false);
    });

    const handleDocumentClick = event => {
        let isEmojiClassFound = false;

        event &&
            event.path &&
            event.path.forEach(elem => {
                if (elem && elem.classList) {
                    const data = elem.classList.value;
                    if (data.includes("emoji")) {
                        isEmojiClassFound = true;
                    }
                }
            }); // end
        if (isEmojiClassFound === false && event.target.id !== "emojis-btn")
            setShowEmojiPicker(false);
    };

    const handleEmojiPickerhideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handleEmojiClick = (event, emojiObject) => {
        let message = comment;
        message += emojiObject.emoji;
        setComment(message);
    };


    const handleClick = async (e) => {
        e.preventDefault()
        setLoading(true)
        handleSubmit({ user: auth.user.id, comment: comment, parentId: replyId })
        setComment('')
        if (userMention) {
            handleNotification(10)
        }
        setTimeout(() => {
            setLoading(false);
        }, 2000);

    }
    const displayTransform = (display, id) => {
        setUsername(id)
        return `@${display}`

    }


    return (
        <ContainerStyled>
            <div className="button-container">
                <Box className='box my-4'>
                    <MentionsInput
                        className='textarea'
                        style={defaultStyle}
                        placeholder="What are your thoughts?"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}>
                        <Mention
                            markup="@__display__ "
                            displayTransform={displayTransform}
                            data={fetchUsers}
                            style={defaultMentionStyle} />
                    </MentionsInput>
                    <div className='panel_container'>
                        <div className="panel">
                            <div className="comment_as">
                                {t('Comment as')} {" "}
                                <span className="username">
                                    {auth.user.firstname}
                                </span>
                            </div>
                            <div className="emoji mx-3 mt-1">
                                <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
                                {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
                            </div>
                        </div>
                        <ChakraProvider>
                            <div className='d-flex mx-2'>
                                <Button className='mx-3' size='sm' disabled={!comment} onClick={handleClick} colorScheme='blue' variant='solid' isLoading={loading}>
                                    {t('Comment')}
                                </Button>
                                {hasCancelButton && <Button size='sm' onClick={handleCancel}>{t('Cancel')}</Button>}
                            </div>
                        </ChakraProvider>
                    </div>
                </Box>
            </div>
        </ContainerStyled>
    )
}
const ContainerStyled = styled.div`
  .button-container {
    .emoji {
      position: relative;
      svg {
        font-size: 1.2rem;
        color: #ffff00c8;
        cursor: pointer;
      }
      .emoji-picker-react {
        position: absolute;
        top: -350px;
        background-color: #667193;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #667193;
          width: 5px;
          &-thumb {
            background-color: #9a86f3;
          }
        }
        .emoji-categories {
            color:black
          button {
            filter: contrast(0);
          }
        }
        .emoji-search {
          background-color: transparent;
          border-color: white;
        }
        .emoji-group:before {
          background-color: #667193;
        }
      }
    }
  }
 
`;
