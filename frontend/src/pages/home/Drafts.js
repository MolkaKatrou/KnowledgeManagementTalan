import { CircularProgress, Container, Grid, makeStyles } from '@material-ui/core';
import React, { useContext } from 'react'
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Post from '../../Components/posts/Post';
import { HomeContext } from '../../Context/HomeContext';
import { getAllPosts } from '../../Redux/Actions/postsActions';
import Home from './Home'

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(10),
    height: '100%',
    backgroundColor: 'rgb(225, 228, 232)'
  },
  mainContainer: {
    borderRadius: 15,
    paddingTop: theme.spacing(5),
    margin: '10px 0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 50px',
  },
  loadingPaper: {
    display: 'flex',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '250px'
  },
}));

export default function Drafts() {
  const classes = useStyles()
  const auth = useSelector(state => state.auth)
  const { posts, loading } = useSelector((state) => state.posts);
  const Drafts = posts.filter(post => post?.isDraft === true && post?.createdby===auth.user.id)
  const { openNote, dispatch, showAlert,t } = useContext(HomeContext)

  useEffect(() => {
    dispatch(getAllPosts())
  }, [dispatch, openNote, showAlert])


  const renderDrafts = Drafts.reverse().map((post, index) => (
    <div key={post._id} >
      <Post
        post={post}
      />
    </div>))

  return (


    <Home>
      <Container className={`${classes.container} backgroundColor`}>
        {loading ?

          < CircularProgress size="3em" elevation={4} className={classes.loadingPaper} />
          :
          <>

            {Drafts.length>0 ? renderDrafts : <div className={classes.loadingPaper} style={{color:'gray'}}>{t('No Drafts')}</div>}

          </>
        }
      </Container>
    </Home>
  )
}
