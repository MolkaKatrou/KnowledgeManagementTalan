import { Box, IconButton } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { Button, ChakraProvider, Menu, MenuButton, MenuList, MenuItem, Avatar, Textarea } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import { HomeContext } from "../../Context/HomeContext";
import { DownVoteAnswer, UpVoteAnswer, deleteAnswer, CommentAnswer, deleteAnswerComment, getAllAnswers, updateAnswer } from "../../Redux/Actions/questionsActions";
import { Confirm } from "semantic-ui-react";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import Editor from "react-quill/lib/index";
import AnswerComment from "./AnswerComment";
import Delete from '@mui/icons-material/Delete';





function Answer({ answer }) {
    Editor.modules = {
        syntax: false,
        toolbar: false,
    };


    const { setShowAlert, showAlert, socket, fetch, setFetch, t } = useContext(HomeContext)
    const dispatch = useDispatch()
    const [comment, setComment] = useState('')
    const auth = useSelector(state => state.auth)
    const userId = auth.user.id
    const hasUpvotedanswer = answer.upVotes.find((vote) => vote === userId);
    const hasDownvotedanswer = answer.downVotes.find((vote) => vote === userId);
    const [upVotes, setUpVotes] = useState(answer.upVotes);
    const [downVotes, setDownVotes] = useState(answer.downVotes);
    const [show, setShow] = useState(false);
    const [newAnswer, setNewAnswer] = useState(answer?.body)
    const [comments, setComments] = useState(answer?.comments)
    const [open, setOpen] = useState(false)
    const [openComment, setOpenComment] = useState(false)

    const [activeAnswer, setActiveAnswer] = useState(null)
    const [activeComment, setActiveComment] = useState(null)
    const isEditing = activeAnswer && activeAnswer.type === "editing" && activeAnswer.id


    useEffect(() => {
        dispatch(getAllAnswers)
    }, [fetch, show])

    const handleQuill = (value) => {
        setNewAnswer(value);
    };

    const handleNotification = (type, receiver) => {
        socket.emit("sendNotification", {
            sender: auth.user,
            receiver,
            postId: answer?.question._id,
            post: 'question',
            type,
        });
    };


    const handleCancel = () => {
        setActiveAnswer(null)
    }

    const DeleteAnswer = (id) => {
        dispatch(deleteAnswer(id))
        setOpen(false)
        setShowAlert(!showAlert)
        toast.success("The answer is successfully deleted!")
    }

    const EditAnswer = () => {
        dispatch(updateAnswer(answer._id, { body: newAnswer }))
        toast.success("The answer is successfully updated!")
        setFetch(!fetch)
        setActiveAnswer(null)
    }

    const SubmitComment = (e) => {
        e.preventDefault()
        const finalComment = {
            user: auth.user.id,
            comment: comment,
            parentId: null
        }
        const newComments = dispatch(CommentAnswer(finalComment, answer._id));
        setFetch(!fetch)
        handleNotification(6, answer?.createdby)
        handleNotification(13, answer?.question?.createdby)
        setComment('');
        setShow(false)
        setComments(newComments);
        toast.success('Comment added successfully')

    }

    const UpVote = () => {
        if (upVotes.length > 0) {
            return upVotes.find((vote) => vote === userId)
                ? (
                    <i className="fa-solid fa-circle-up" style={{ color: 'green' }}></i>
                ) : (
                    <i className="fa-solid fa-circle-up" style={{ color: 'gray' }}></i>
                );
        }

        return <i className="fa-solid fa-circle-up" style={{ color: 'gray' }}></i>
    };

    const DownVote = () => {
        if (downVotes.length > 0) {
            return downVotes.find((vote) => vote === userId)
                ? (
                    <i className="fa-solid fa-circle-down" style={{ color: 'green' }}></i>
                ) : (
                    <i className="fa-solid fa-circle-down" style={{ color: 'gray' }}></i>
                );
        }

        return <i className="fa-solid fa-circle-down" style={{ color: 'gray' }}></i>
    };

    const handleUpVote = async () => {
        dispatch(UpVoteAnswer(answer._id));
        if (hasUpvotedanswer) {
            setUpVotes(answer.upVotes.filter((id) => id !== userId));
        } else {
            setDownVotes(answer.downVotes.filter((id) => id !== userId));
            setUpVotes([...answer.upVotes, userId]);
            handleNotification(7)
        }
    };

    const handleDownVote = async () => {
        dispatch(DownVoteAnswer(answer._id));
        if (hasDownvotedanswer) {
            setDownVotes(answer.downVotes.filter((id) => id !== userId));
        }
        else {
            setUpVotes(answer.upVotes.filter((id) => id !== userId));
            setDownVotes([...answer.downVotes, userId]);
            handleNotification(8)
        }
    };

    return (
        <div className="mb-2">
            <div className="answer-container">
                <div className="d-flex justify-content-between author-answer">
                    <div className=" mt-2 d-flex flex-row my-2 ">
                        <ChakraProvider>
                            <Avatar name={answer.createdby.fullname} src={answer.createdby.pic} size='sm' style={{ height: 32, width: 32 }} className='mx-2' />
                        </ChakraProvider>
                        <Box className=" mx-2 author-infos" style={{ fontWeight: '600', marginTop:'5px'  }}> {answer.createdby.fullname}</Box>
                        <Box className="mx-2 me-2" style={{ color: 'grey' , marginTop:'5px' }}>{`Answered ${moment(answer.createdAt).fromNow()}`}</Box>
                        {answer.createdAt !== answer.updated_At ?
                            <Box className="mx-2 me-2" style={{ color: 'grey',marginTop:'5px' }}> {t('Updated')}
                                <span> {moment(answer?.updated_At).fromNow()} </span>
                            </Box> : ''
                        }

                    </div>
                    {
                        auth.user.email === answer.createdby.email ? (
                            <ChakraProvider>
                                <Menu isLazy>
                                    <MenuButton className='info'><MoreVertIcon /></MenuButton>
                                    <MenuList className='backgroundColor'>
                                        <MenuItem icon={<DeleteIcon style={{ marginRight: '30px', color: 'gray' }} />}
                                            onClick={() => { setOpen(true) }} >
                                            Delete
                                        </MenuItem>
                                        <MenuItem icon={<EditIcon style={{ marginRight: '30px', color: 'gray' }} />}
                                            onClick={() => setActiveAnswer({ id: answer._id, type: 'editing' })} >
                                            Edit
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </ChakraProvider>
                        ) : ('')
                    }
                    <Confirm
                        open={open}
                        confirmButton={t("Delete Answer")}
                        cancelButton={t('Cancel')}
                        content={t('Are you sure you want to delete this answer?')}
                        onCancel={() => { setOpen(false) }}
                        onConfirm={() => { DeleteAnswer(answer._id) }}
                        style={{ height: '19%', overflow:'hidden' }}                    
                    />


                </div>

                <div className="all-answers-container">
                    <div className="all-questions-left">
                        <div className="all-options" >
                            <IconButton className="arrow" onClick={handleUpVote}> <UpVote /></IconButton>
                            <p className="arrow info"> <i>{upVotes?.length - downVotes?.length || 0}</i></p>
                            <IconButton className="arrow" onClick={handleDownVote}><DownVote /></IconButton>
                        </div>
                    </div>

                    {!isEditing && <div className="question-answer">
                        <div className='card-content' dangerouslySetInnerHTML={{__html: answer?.body}}/>
                    </div>}

                    {isEditing && <div className="question-answer">
                        <div className='card-content'>
                            <ReactQuill
                                value={newAnswer}
                                onChange={handleQuill}
                                modules={Editor.modules}
                                theme="snow"
                                style={{
                                    minHeight: '10px'
                                }}
                            />
                            <ChakraProvider>
                                <div className="d-flex mt-2">
                                    <Button disabled={!newAnswer} size='sm' onClick={EditAnswer} colorScheme='blue'>Update</Button>
                                    <Button size='sm' className="mx-3" onClick={handleCancel}>Cancel</Button>
                                </div>
                            </ChakraProvider>
                        </div>
                    </div>}

                </div>
            </div>
            {answer.comments?.map((c, i) => (
                <div key={c._id}>
                    <AnswerComment c={c} setOpenComment={setOpenComment} openComment={openComment} />
                </div>
            ))}
            <div className="comments">

                <p
                    style={{ margin: "5px 0px", padding: "10px" }}
                    className='info'
                    onClick={() => setShow(!show)}>
                    Add a comment
                </p>
                {show && (
                    <div className="title">
                        <textarea
                            style={{
                                margin: "5px 0px",
                                padding: "10px",
                                border: "1px solid rgba(0, 0, 0, 0.2)",
                                borderRadius: "3px",
                                outline: "none",
                                backgroundColor: 'transparent'
                            }}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            type="text"
                            placeholder="Add your comment..."
                            rows={5}
                        />
                        <ChakraProvider>
                            <Button colorScheme='teal' variant='solid' className="mt-3" disabled={!comment} onClick={SubmitComment}>
                                Add Comment
                            </Button>

                        </ChakraProvider>
                    </div>


                )}
            </div>


        </div>

    );
}

export default Answer;











