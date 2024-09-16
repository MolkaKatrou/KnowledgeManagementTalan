import React, { useContext, useEffect, useState } from 'react'
import { Typography } from '@material-ui/core';
import TextArea from "react-textarea-autosize";
import { useDispatch, useSelector } from 'react-redux';
import { commentPost, deleteComment, getAllPosts } from '../../Redux/Actions/postsActions';
import { Box } from '@mui/system';
import { Avatar, Button, ChakraProvider } from '@chakra-ui/react';
import { HomeContext } from '../../Context/HomeContext';
import toast from 'react-hot-toast';
import SingleComment from './Comment';
import CommnetArea from './CommnetArea';

function CommentSection({ post }) {
  const [commentId, setCommentId] = useState('')
  const { t, socket, showAlert, replyId, setReplyId} = useContext(HomeContext)
  const auth = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const [comments, setComments] = useState(post?.comments)
  const rootComments = post?.comments.filter((c) => c.parentId === null)
  const [activeComment, setActiveComment] = useState(null)

  const getReplies = (commentId) => {
    return post?.comments.filter(c => c.parentId === commentId)
  }

  useEffect(() => {
    dispatch(getAllPosts())
  }, [showAlert])



  const handleNotification = (type) => {
    socket.emit("sendNotification", {
      sender: auth.user,
      receiver: post.createdby,
      postId: post._id,
      post: 'post',
      type,
    });
  };

  const handleSubmit = ({user, comment,parentId}) => {
    const newComments = dispatch(commentPost({user, comment, parentId:null}, post._id));
    handleNotification(3)
    setComments(newComments);
    toast.success("The comment is successfully added")
  }

  const handleSubmitReply = ({user, comment,parentId}) => {
    const newComments = dispatch(commentPost({user, comment,parentId}, post._id));
    handleNotification(3)
    setComments(newComments);
    setTimeout(() => {
      setActiveComment(null)
      setReplyId(null)
    }, 2000);
    toast.success("The reply is successfully added")

  }



  return (
    <>
      <Typography component={'div'}>
        <span className='posts_comments'>{t('Comments')}</span>
        <span className="comments_count">{`(${rootComments?.length})`}</span>
      </Typography>
      {rootComments.map((rootComment, i) => (
        <SingleComment
          c={rootComment}
          key={rootComment._id}
          replies={getReplies(rootComment._id)}
          activeComment={activeComment}
          setActiveComment={setActiveComment}
          parentId ={rootComment._id}
          handleSubmitReply={handleSubmitReply}
        />
      ))}

  <CommnetArea handleSubmit={handleSubmit} post={post}/>


    </>

  )
}

export default CommentSection

