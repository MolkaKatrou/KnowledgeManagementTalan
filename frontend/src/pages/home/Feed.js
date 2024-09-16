import React, { useState, useEffect, useContext } from 'react'
import { Container, makeStyles, CircularProgress, Grid } from "@material-ui/core"
import Post from '../../Components/posts/Post'
import { getAllPosts, getPostsBySearch } from '../../Redux/Actions/postsActions';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import Home from './Home';
import Question from "../../Components/Questions&Answers/Question";
import { HomeContext } from '../../Context/HomeContext';
import Alert from '@mui/material/Alert';
import { getAllAnswers, getAllQuestions } from '../../Redux/Actions/questionsActions';
import { Button, Divider } from 'semantic-ui-react';
import axios from 'axios';
import { ChakraProvider } from '@chakra-ui/react';
import PostsLoading from '../../Components/PostsLoading';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(10),
    height: '100%',
    backgroundColor: 'rgb(225, 228, 232)'
  },
  loadingPaper: {
    display: 'flex',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '250px'
  },
}));

function useQuery() {
  return new URLSearchParams(useLocation().search);
}


function Feed() {
  const classes = useStyles()
  const postsList = useSelector(state => state.posts)
  const QuestionsList = useSelector(state => state.questions)
  const auth = useSelector(state => state.auth)
  const userId = auth.user.id
  const posts = postsList.posts
  const questions = QuestionsList.questions
  const FollowedPosts = posts?.filter(post => post.category.followers.includes(userId) && post.isDraft===false)
  const FollowedQuestions = questions?.filter(question => question.category.followers.includes(userId))
  const query = useQuery();
  const [notes, setNotes] = useState(true)
  const [qa, setQa] = useState(true)
  const FollowedNotesAndQuestions = FollowedPosts?.concat(FollowedQuestions);
  const {t, showAlert, dispatch, openNote, liked, search, setSearch, openModal, showVerified, loading  } = useContext(HomeContext)

  useEffect(() => {
    dispatch(getAllPosts())
    dispatch(getAllQuestions())
    dispatch(getAllAnswers())
  }, [dispatch, openNote, liked,openModal])

  const handleAll = () => {
    setNotes(true)
    setQa(true)
  }

  const handleQa = () => {
    setNotes(false)
    setQa(true)
  }
  const handleNotes = () => {
    setNotes(true)
    setQa(false)
  }

  const renderLatestPosts = FollowedPosts?.reverse().map((post, index) => (
    <Grid key={post._id}>
      <Post
        post={post}
      />
    </Grid>
  )
  )

  const renderLatestQuestions = FollowedQuestions?.reverse().map((question, index) => (

    <Grid key={question._id}>
      <Question
        question={question}
      />
    </Grid>
  )
  )

  const renderLatestAll = FollowedNotesAndQuestions?.sort(function (a, b) {
    return new Date(b.createdAt) - new Date(a.createdAt);
  }).map((item, index) => (
    <>
      {item.content ?
        <Grid key={item._id}>
          <Post post={item} />
        </Grid>
        :
        <Grid key={item._id}>
          <Question question={item} />
        </Grid>
      }
    </>
  )
  )



  return (
    <Home>
      <Container className={`${classes.container} backgroundColor`}>
      {showVerified ? <Alert severity="success" style={{backgroundColor:'#64A85E82'}}>{t('Your account has been successfully verified, welcome!')}</Alert> : ""}
        <div className="main-tabs-home mt-3">
          <Button.Group widths='3' className='buttonGroup'>
            <Button active={ notes && qa ? 'true' : ''}  className='buttonGroup' onClick={handleAll}> {t('All')}</Button>
            <Button active={ notes && !qa ? 'true' : ''}  className='buttonGroup' onClick={handleNotes}> {t('Notes')}</Button>
            <Button active={ !notes && qa ? 'true' : ''}  className='buttonGroup' onClick={handleQa}> {t('Questions/Answers')}</Button>
          </Button.Group>
        </div>

        <Divider className='mb-4' />

        {postsList.loading ?
          < CircularProgress size="3em" elevation={4} className={classes.loadingPaper} />
          : loading ?
          <ChakraProvider>
            <PostsLoading/>
          </ChakraProvider> :
          notes && qa ? renderLatestAll : notes && !qa ? renderLatestPosts : renderLatestQuestions
        }
           
      </Container>
    </Home>
  )
}

export default Feed