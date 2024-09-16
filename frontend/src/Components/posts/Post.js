import React, { useEffect, useContext } from 'react';
import { makeStyles, Box, Card, CardHeader, CardContent, CardActions, Typography, IconButton } from "@material-ui/core"
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import CommentIcon from '@mui/icons-material/ModeCommentOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { likePost, BookmarkPost, deletePost, getAllPosts } from '../../Redux/Actions/postsActions';
import { useState } from 'react';
import BookmarkIcon from '@mui/icons-material/BookmarkOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import moment from 'moment';
import { HomeContext } from '../../Context/HomeContext';
import { Menu, MenuButton, MenuList, MenuItem, Avatar, Button } from "@chakra-ui/react";
import { ChakraProvider } from '@chakra-ui/react'
import { Confirm } from 'semantic-ui-react'
//import ReactHtmlParser from "react-html-parser";
import toast from 'react-hot-toast';
import Delete from '@mui/icons-material/Delete';



const ITEM_HEIGHT = 48;

const useStyles = makeStyles((theme) => ({
  category: {
    border: 0,
    borderRadius: 10,
    color: 'white',
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
  },


  card: {
    maxWidth: 570,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    cursor: 'pointer',
    marginBottom: '40px',
    background: 'rgb(234, 233, 240)'
  }

}));
export default function Post({ post }) {
  const {t, setOpenNote, setShowAlert, socket, showAlert, setCurrentId, dispatch, liked, setLiked, buttonAdd } = useContext(HomeContext)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const classes = useStyles()
  const [likes, setLikes] = useState(post?.likes);
  const [bookmarks, setBookmarks] = useState(post?.bookmarks);
  const auth = useSelector(state => state.auth)
  const userId = auth.user.id
  const hasLikedPost = post?.likes?.find((like) => like === userId);
  const hasBookmarkedPost = post?.bookmarks?.find((bookmark) => bookmark === userId);
  const location = useLocation()


  const handleNotification = (type) => {
    socket.emit("sendNotification", {
      sender: auth.user,
      receiver: post.createdby,
      type,
      postId: post._id,
      post: 'post',

    });
  };

  useEffect(() => {
    setLikes(post?.likes)
    setBookmarks(post?.bookmarks)
  }, [post._id])

  const UpdatePost = (e) => {
    e.stopPropagation();
    setCurrentId(post._id);
    setOpenNote(true)
  }

  const DeletePost = () => {
    dispatch(deletePost(post?._id))
    setOpen(false)
    toast.success("The post is successfully deleted")
    setShowAlert(!showAlert)
  }

  const Bookmarks = () => {
    if (bookmarks?.length > 0) {
      return bookmarks?.find((bookmark) => bookmark === userId)
        ? (
          <BookmarkIcon style={{ color: '#937474' }} />
        ) : (
          <BookmarkOutlinedIcon className='info-post'/>
        );
    }

    return <BookmarkOutlinedIcon className='info-post' />
  };

  const Likes = () => {
    if (likes?.length > 0) {
      return likes?.find((like) => like === userId)
        ? (
          <><FavoriteIcon style={{ color: '#DA3131' }} />&nbsp;<span className='info-post' style={{ fontSize: '16px' }}>{likes?.length > 2 ? t(`You and ${likes?.length - 1} others`) : `${likes?.length} ${t('Like')}${likes?.length > 1 ? 's' : ''}`}</span></>
        ) : (
          <><FavoriteOutlinedIcon className='info-post' />&nbsp;<span className='info-post' style={{ fontSize: '16px' }}>{likes?.length} {likes?.length === 1 ? t('Like') : t('Likes')}</span></>
        );
    }

    return <><FavoriteOutlinedIcon className='info-post' />&nbsp;<span className='info-post' style={{ fontSize: '16px' }}>{t('Like')}</span></>;
  };

  const handleLike = async () => {
    dispatch(likePost(post._id));
    if (hasLikedPost) {
      setLikes(post.likes.filter((id) => id !== userId));
      setLiked(!liked)
    } else {
      setLikes([...post.likes, userId]);
      setLiked(!liked)
      handleNotification(1)
    }
    dispatch(getAllPosts())
  };

  const handleBookmark = async () => {
    dispatch(BookmarkPost(post._id));
    if (hasBookmarkedPost) {
      setBookmarks(post.bookmarks.filter((id) => id !== userId));
      setLiked(!liked)
    } else {
      setBookmarks([...post.bookmarks, userId]);
      setLiked(!liked)
      handleNotification(2)
    }
    dispatch(getAllPosts())

  };



  return (
    <ChakraProvider>
      <Card className={`${classes.card} card-color`} style={{ border: post.isDraft ? '1px solid #856565' : '' }}>
        <CardHeader
          avatar={
            <ChakraProvider>
              <Avatar name={post?.createdby?.fullname} src={post?.createdby?.pic} />

            </ChakraProvider>

          }
          action={
            <>

              {
                auth.user.email === post?.createdby?.email ? (
                  <Menu isLazy>
                    <MenuButton><MoreVertIcon /></MenuButton>
                    <MenuList className='backgroundColor'>
                      <MenuItem icon={<DeleteIcon style={{ marginRight: '30px', color: 'gray' }} />}
                        onClick={() => { setOpen(true) }}
                      >
                        {t('Delete')}
                      </MenuItem>
                      <MenuItem icon={<EditIcon style={{ marginRight: '30px', color: 'gray' }} />}
                        onClick={UpdatePost}
                      >
                        {post.isDraft ? t('Create Post') : t('Edit') }
                      </MenuItem>
                    </MenuList>
                  </Menu>
                ) : ('')
              }
              <Confirm
                confirmButton={t("Delete Post")} 
                cancelButton={t('Cancel')}
                content={t('Are you sure you want to delete this post?')}
                open={open}
                onCancel={() => { setOpen(false) }}
                onConfirm={DeletePost}
                style={{ height: '19%', overflow:'hidden'}}
                className='backgroundColor'
              />
            </>

          }
          title={
            <div className='d-flex'>
              <div className='col-4'> {post?.createdby.fullname} </div>

              <Typography component={'div'} className='col-6' onClick={() => navigate(`/category/${post?.category._id}/notes`)} style={{ color: `${post.category.color}`, textAlign: 'center', fontWeight: '600', display: location.pathname === `/category/${post?.category._id}/notes` ? "none" : "flex" }}>
                {`  ${post?.category.name} `}

              </Typography>

              <Typography component={'div'} className='col-4' onClick={() => navigate(`/category/${post?.category._id}/notes`)} style={{ color: `#E3C4C4`, fontWeight: '600', display: post.isDraft ? "flex" : "none" }}>
                <ErrorIcon className='mx-2' /> {t('Draft')}

              </Typography>

            </div>
          }
          subheader={
          <div className='d-flex info-post'>
            {moment(post?.createdAt).fromNow()}

            {post.createdAt !== post.updated_At && post.isDraft === false ? 
            <p className='d-flex'>
              <span style={{fontWeight:'700'}} className='mx-2'>{t('updated')} </span>
                {`${moment(post?.updated_At).fromNow()}`} 
              </p> : ''}

          </div>}
        >
        </CardHeader>
        <CardContent>
          <Typography component={'div'} style={{ fontWeight: '550', fontFamily: 'Raleway,sans-serif', fontSize: '16px' }} onClick={() => navigate(`/post/${post?._id}`)}>
            {post.title}
          </Typography>
          <div className='card-content mt-3' dangerouslySetInnerHTML={{__html: post?.content}}/>
        </CardContent>
        {post.isDraft === false ?
          <CardActions disableSpacing>
            <IconButton onClick={handleLike} className="MyCustomButton">
              <Likes />
            </IconButton>
            <IconButton onClick={() => navigate(`/post/${post?._id}`)} className="MyCustomButton" >
              <CommentIcon className='info-post' fontSize="small" />&nbsp;
              <span className='info-post' style={{ fontSize: '16px' }}>{post?.comments?.length} {t('Comments')}</span>
            </IconButton>
            <IconButton onClick={handleBookmark} className="MyCustomButton">
              <Bookmarks />
            </IconButton>

          </CardActions>
          : ''}


      </Card>
    </ChakraProvider>
  );
}