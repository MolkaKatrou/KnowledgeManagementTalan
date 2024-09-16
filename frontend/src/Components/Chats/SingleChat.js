import { Box, FormControl,Avatar, IconButton, Input, InputGroup, InputRightElement, Spinner, Text, useToast } from '@chakra-ui/react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { HomeContext } from '../../Context/HomeContext'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ProfileModal from './ProfileModal';
import { getSender, getSenderFull, getSenderPic } from './ChatLogic';
import UpdateChatModal from './UpdateChatModal';
import ScrollableChat from './ScrollableChat';
import axios from 'axios';
import Lottie from "react-lottie";
import animationData from "../../animations/typing.json";
import animationWelcome from "../../animations/hello.json";
import AttachmentIcon from '@mui/icons-material/Attachment';
import SendIcon from '@mui/icons-material/Send';
import Picker from "emoji-picker-react";
import { BsEmojiSmileFill } from "react-icons/bs";
import styled from "styled-components";

var selectedChatCompare

export default function SingleChat({ fetchAgain, setFetchAgain }) {
    const { t, socket, selectedChat, setSelectedChat, socketConnected, setSocketConnected, notificationChat, setNotificationChat, notification, setNotification, token } = useContext(HomeContext)
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false)
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState("")
    const [uploadedFile, setUploadedFile] = useState({})
    const bottomRef = useRef(null);
    const [newMessage, setNewMessage] = useState("");
    const toast = useToast();
    const [typing, setTyping] = useState(false);
    const auth = useSelector(state => state.auth)
    const user = auth.user

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const WelcomeOptions = {
        loop: true,
        autoplay: true,
        animationData: animationWelcome,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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
        let message = newMessage;
        message += emojiObject.emoji;
        setNewMessage(message);
    };

    const ImportAttachement = (file) => {
        setFile(file)
        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file", file);
        axios.post('/Api/uploadfiles', formData, config)
            .then(response => {
                const { success, url, fileName } = response.data
                setUploadedFile({ success: true, url, fileName })
                let message = newMessage
                message += response.data.fileName
                setNewMessage(message)
            })
    }

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            setLoading(true);
            const { data } = await axios.get(`/api/message/${selectedChat._id}`);
            setMessages(data);
            setLoading(false);
            socket.emit('join chat', selectedChat._id);

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };
    const handleKeyPress = async (e) => {
        if (e.key === "Enter" && newMessage) {
            sendMessage()
        }

    }


    const sendMessage = async (event) => {
        socket.emit('stop typing', selectedChat._id)
        try {
            const { data } = await axios.post("/api/message", { content: newMessage.replace(uploadedFile.fileName, ' '), file: uploadedFile.url, chatId: selectedChat });
            console.log(data)
            setNewMessage('')
            setUploadedFile({})
            socket.emit("new message", data)
            setMessages([...messages, data]);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to send the Message",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

        }
    }


    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        socket.on('typing', () => setIsTyping(true))
        socket.on('stop typing', () => setIsTyping(false))
    })

    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                if (!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification]);
                    setFetchAgain(!fetchAgain);
                    setNotificationChat(true)
                }
            }
            else {
                setMessages((prev) => [...prev, newMessageReceived]);
            }
        })
    })



    const typingHandler = (e) => {
        setNewMessage(e.target.value)
        if (!socketConnected) return;
        if (!typing) {
            setTyping(true)
            socket.emit('typing', selectedChat._id)
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;

        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    }



    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="Work sans"
                        d="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            d={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIosIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                              <div className='d-flex'>
                                <Avatar size='md' style={{width:'36px' , height:'36px', marginTop:'3px'}} name={getSender(user, selectedChat.users)} src={getSenderPic(user, selectedChat.users)}></Avatar>
                                <div className='mx-3'>{getSender(user, selectedChat.users)}</div>
                              </div>
                                <ProfileModal
                                    user={getSenderFull(user, selectedChat.users)}
                                />
                            </>

                        ) : (
                            <>
                                {selectedChat.chatName}
                                <UpdateChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
                            </>
                        )

                        }
                    </Text>
                    <Box
                        d="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#E8E8E8"
                        className="chats"
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="hidden"
                    >
                        {loading ? (
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />
                        ) : (
              
                            <ScrollableChat messages={messages} user={user}/>
                        )}
                        
                        <FormControl
                            onKeyDown={handleKeyPress}
                            id="first-name"
                            isRequired
                            mt={3}
                        >
                            {isTyping ? (
                                <div>
                                    <Lottie
                                        options={defaultOptions}
                                        // height={50}
                                        width={20}
                                        style={{ marginBottom: 15, display: 'flex', justifyContent: 'center' }}
                                    />
                                </div>
                            ) : (
                                <></>
                            )}
                            <ContainerStyled>
                                <div className="button-container">
                                    <div className="emoji">
                                        <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
                                        {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
                                    </div>
                                    <div>

                                        <label htmlFor="attachement">
                                            <input
                                                accept="file/*"
                                                id="attachement"
                                                type="file"
                                                style={{ display: 'none' }}
                                                onChange={(e) => ImportAttachement(e.target.files[0])}

                                            />
                                            <AttachmentIcon style={{ color: 'gray', cursor: 'pointer' }} />
                                        </label>
                                    </div>
                                    <InputGroup>

                                        <Input
                                            variant="filled"
                                            className='inputMessage'
                                            placeholder={t("Enter a message..")}
                                            value={newMessage}
                                            onChange={typingHandler}
                                            autoComplete="off"

                                        />
                                        <InputRightElement children={<SendIcon className='question-title' style={{ cursor: 'pointer' }} onClick={sendMessage} />} />
                                    </InputGroup>
                                </div>
                            </ContainerStyled>

                        </FormControl>


                    </Box>

                </>
            ) : (
                <Box className='d-flex justify-content-center align-items-center' h="100%">
                    <Text fontSize="3xl" pb={3} fontFamily="Work sans" style={{ color: 'gray' }}>
                        <div>
                            <Lottie
                                options={WelcomeOptions}
                                height={150}
                                width={180}
                                style={{ marginBottom: 15, display: 'flex', justifyContent: 'center' }}
                            />
                        </div>
                        {t('Click on a collaborator to start Chatting')}
                    </Text>
                </Box>
            )


            }

        </>
    )
}

const ContainerStyled = styled.div`
  .button-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
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
