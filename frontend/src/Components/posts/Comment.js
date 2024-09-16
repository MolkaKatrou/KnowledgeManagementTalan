import moment from 'moment'
import React, { useContext, useEffect, useState } from 'react'
import TextArea from "react-textarea-autosize";
import { deleteComment, updateComment } from '../../Redux/Actions/postsActions';
import { Comment, Confirm } from 'semantic-ui-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Button, ChakraProvider } from '@chakra-ui/react';
import { HomeContext } from '../../Context/HomeContext';
import { Divider } from '@material-ui/core'
import CommnetArea from './CommnetArea';


export default function SingleComment({ c, parentId = null, handleSubmitReply, replies, activeComment, setActiveComment }) {
    const comment = c?.comment.replace(/(\@.*\ )/gi, match => <span style="color: blue"> {match} </span>);
    const auth = useSelector(state => state.auth)
    const [open, setOpen] = useState(false)
    const [text, setText] = useState(c.comment)
    const dispatch = useDispatch()
    const { t, showAlert, setShowAlert, replyId, setReplyId } = useContext(HomeContext)
    const isReplying = activeComment && activeComment.type === "replying" && activeComment.id === c._id
    const isEditing = activeComment && activeComment.type === "editing" && activeComment.id === c._id

    useEffect(() => {
        setReplyId(parentId ? parentId : c._id)
    }, [c])


    const DeleteComment = (_id) => {
        dispatch(deleteComment(_id))
        toast.success("The comment is successfully deleted!")
        setShowAlert(!showAlert)
        setOpen(false)
    }

    const UpdateComment = (_id) => {
        dispatch(updateComment(_id, { comment: text }))
        toast.success("The comment is successfully updated!")
        setActiveComment(null)
        setShowAlert(!showAlert)
    }

    const handleCancel = () => {
        setActiveComment(null)
    }

    return (
        <>
        <Comment.Group>
            <Comment >
                <ChakraProvider>
                    <Avatar name={c?.user?.fullname} src={c?.user?.pic} style={{ width: 35, height: 35 }} size='sm' mr={5} />
                </ChakraProvider>
                <Comment.Content style={{ marginTop: '-35px' }} className='mx-5'>
                    <Comment.Metadata className='mx-2 d-flex'>
                        <Comment.Author as='a'><div className='info-post'>{c?.user?.fullname}</div></Comment.Author>
                        <div className='info-post'>{moment(c?.createdAt).fromNow()}</div>
                        {auth.user.id === c?.user?._id ?
                            <div className='d-flex'>
                                <div className='mx-2' style={{ cursor: 'pointer', color: 'gray' }} onClick={() => setActiveComment({ id: c._id, type: 'editing' })} >Edit</div>
                                <div style={{ cursor: 'pointer', color: 'gray' }} onClick={() => { setOpen(true) }} >Delete</div>
                            </div> : ''
                        }
                        <Confirm
                            confirmButton={t("Delete Comment")}
                            cancelButton={t('Cancel')}
                            content={t('Are you sure you want to delete this comment?')}
                            open={open}
                            onCancel={() => { setOpen(false) }}
                            onConfirm={() => { DeleteComment(c._id) }}
                            style={{ height: '19%', overflow: 'hidden' }}
                        />
                    </Comment.Metadata>
                    {!isEditing &&
                        <Comment.Text className='mx-2'>
                            <div className='dark' dangerouslySetInnerHTML={{ __html: c.comment }}></div>
                        </Comment.Text>}
                    {isEditing &&
                        <div>
                            <TextArea
                                style={{ backgroundColor: 'transparent' }}
                                className='textarea-edit mt-2 mx-1'
                                placeholder="What are your thoughts?"
                                minRows={2}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                            <ChakraProvider className='d-flex'>
                                <Button className=' mt-2 mx-1' size='sm' colorScheme='blue' variant='solid' onClick={() => { UpdateComment(c._id) }} >
                                    {t('Update')}
                                </Button>
                                <Button className=' mt-2 mx-1' size='sm' variant='solid' onClick={handleCancel} >
                                    {t('Cancel')}
                                </Button>
                            </ChakraProvider>
                        </div>

                    }
                    {!isEditing && <div className='mx-2' style={{ cursor: 'pointer', color: 'gray', fontSize: '10px' }} onClick={() => setActiveComment({ id: c._id, type: 'replying' })}>Reply</div>}
                </Comment.Content>
            </Comment>
            {isReplying && (
                <CommnetArea
                    handleSubmit={handleSubmitReply}
                    hasCancelButton={true}
                    handleCancel={handleCancel} />
            )}
            {replies.length > 0 && (
                <div className='mx-5 mt-4'>
                    {replies.map(reply => (
                        <SingleComment
                            c={reply}
                            key={reply._id}
                            replies={[]}
                            activeComment={activeComment}
                            setActiveComment={setActiveComment}
                            handleSubmitReply={handleSubmitReply}
                        />))}
                </div>
            )}
            <Divider className='my-1' />
        </Comment.Group>

        </>
    )
}
