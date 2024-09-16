import { CardContent, Divider, makeStyles, IconButton, CardActions, Typography } from "@material-ui/core";
import React, { useEffect, useState, useContext } from "react";
import CommentSection from "./CommentSection";
import { getAllPosts, likePost, BookmarkPost } from "../../Redux/Actions/postsActions";
import moment from 'moment';
import { useDispatch, useSelector } from "react-redux";
import BookmarkIcon from '@mui/icons-material/BookmarkOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { HomeContext } from "../../Context/HomeContext";


const useStyles = makeStyles((theme) => ({
  loadingPaper: {
    display: 'flex',
    justifyContent: 'center',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: '250px'
  },
  container: {
    paddingTop: theme.spacing(10),
    height: '100%',
    backgroundColor: 'rgb(225, 228, 232)'
  },
  card: {
    maxWidth: 720,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '60px',
    background: 'transparent'

  },
}))

export default function MainPost({ post }) {
  const {t, liked, setLiked, socket } = useContext(HomeContext)
  const classes = useStyles()
  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)
  const userId = auth.user.id
  const [likes, setLikes] = useState(post.likes);
  const [bookmarks, setBookmarks] = useState(post.bookmarks);
  const hasLikedPost = post?.likes?.find((like) => like === userId);
  const hasBookmarkedPost = post?.bookmarks?.find((bookmark) => bookmark === userId);

  const handleNotification = (type) => {
    socket.emit("sendNotification", {
      sender: auth.user,
      receiver: post.createdby,
      postId: post._id,
      post: 'post',
      type,
    });
  };

  const Bookmarks = () => {
    if (bookmarks?.length > 0) {
      return bookmarks?.find((bookmark) => bookmark === userId)
        ? (
          <BookmarkIcon style={{ color: '#937474' }} />
        ) : (
          <BookmarkOutlinedIcon className='info-post' />
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
          <><FavoriteOutlinedIcon className='info-post' />&nbsp;<span className='info-post' style={{ fontSize: '16px' }}>{likes.length} {likes?.length === 1 ? t('Like') : t('Likes')}</span></>
        );
    }

    return <><FavoriteOutlinedIcon className='info-post' />&nbsp;<span className='info-post' style={{ fontSize: '16px' }}>{t('Like')}</span></>;
  };

  const handleLike = async () => {
    dispatch(likePost(post._id));
    if (hasLikedPost) {
      setLikes(post?.likes.filter((id) => id !== userId));
      setLiked(!liked)
    } else {
      setLikes([...post?.likes, userId]);
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
    <div className="main">
      <div className="main-container">
        <div className="main-top">
          <h2 className="main-question"> {post?.title} </h2>
        </div>
        <Typography variant='subtitle1' gutterBottom style={{ color: `${post?.category?.color}` }}>
          {post?.category?.name}
        </Typography>
        <div className="main-desc">
          <div className="info">
            <p>
              {t('Written by')}
              <span> {post?.createdby.fullname} </span>
            </p>
            <p>
              {t('Posted')} <span>{moment(post.createdAt).fromNow()}</span>
            </p>
            {post.createdAt !== post.updated_At && post.isDraft === false ?
              <p> {t('Updated')}
                <span> {moment(post?.updated_At).fromNow()} </span>
              </p> : ''
            }
          </div>
        </div>
        <div className="all-questions">
          <div className="all-questions-left">
          </div>
          <div className="question-answer">
            <div className="card-content" dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>
        <CardActions disableSpacing className="mx-2">
          <IconButton onClick={handleLike} className="MyCustomButton">
            <Likes />
          </IconButton>
          <IconButton onClick={handleBookmark} className="MyCustomButton">
            <Bookmarks />
          </IconButton>

        </CardActions>
        <Divider component='ul' />
        <CardContent>
          <CommentSection post={post} />
        </CardContent>
      </div>
    </div>
  )
}
