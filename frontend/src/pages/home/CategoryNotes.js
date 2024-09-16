import React, { useEffect, useState, useContext } from "react";
import Home from './Home'
import Post from '../../Components/posts/Post'
import { Container, makeStyles, CircularProgress, Grid } from "@material-ui/core"
import CategoryBanner from "../../Components/CategoryBanner";
import { useSelector } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import { getAllPosts } from '../../Redux/Actions/postsActions';
import { HomeContext } from '../../Context/HomeContext';
import Alert from '@mui/material/Alert';
import { createCategoryList } from "../../utils/functions";
import { Button } from "semantic-ui-react";
import FilterListIcon from "@material-ui/icons/FilterList";
import { ChakraProvider } from "@chakra-ui/react";
import PostsLoading from "../../Components/PostsLoading";



const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(10),
    height: '100%',
    backgroundColor: 'rgb(225, 228, 232)'
  },

  card: {
    paddingBottom: theme.spacing(4),
  },

  loadingPaper: {
    display: 'flex',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '250px'
  },
}));


export default function CategoryNotes() {
  const { id } = useParams();
  const classes = useStyles()
  const postsList = useSelector(state => state.posts)
  const categoriesList = useSelector(state => state.categories)
  const filteredCategories = createCategoryList(categoriesList.categories).filter(cat => cat.value == id)
  const categoryPosts = postsList.posts
  const filteredPosts = categoryPosts.filter(post => post.category._id == id && post.isDraft === false)
  const [latest, setLatest] = useState(true)
  const { t, showAlert, openNote, dispatch, liked, loading } = useContext(HomeContext)


  useEffect(() => {
    dispatch(getAllPosts())
  }, [dispatch, openNote, liked, showAlert])


  const renderLatestPosts = filteredPosts.reverse().map((post, index) => {
    return <div key={post._id} >
      <Post
        post={post}
      />
    </div>
  }
  )

  const renderTrendingPosts = filteredPosts.sort(function (one, other) {
    return other.likes.length - one.likes.length;
  }).map((post, index) => (
    <Grid key={post._id}>
      <Post
        post={post}
      />
    </Grid>
  )
  )

  return (
    <Home>
      <Container className={`${classes.container} backgroundColor`}>
        {postsList.loading ?
          < CircularProgress size="3em" elevation={4} className={classes.loadingPaper} />
          : 

            filteredCategories.map((category, index) => (
              <Grid key={category._id}>
                <CategoryBanner category={category} />
              </Grid>
            ))}


        <div className="main">
          <div className="main-container">
            <div className="main-top">
              <h2>{t('All Notes')}</h2>


            </div>
            <div className="main-desc">
              <p>{`${filteredPosts.length} Note${filteredPosts.length > 1 ? 's' : ''}`}</p>

              <div className="main-tabs">
                <Button.Group>
                  <Button active={latest ? 'true' : ''} className="main-tabs-button" onClick={() => setLatest(true)}>{t('Latest')}</Button>
                  <Button active={latest ? '' : 'true'} className="main-tabs-button" onClick={() => setLatest(false)}>{t('Most popular')}</Button>
                </Button.Group>
              </div>
              <div className="main-filter-item">
                <FilterListIcon />
                <p>Filter</p>

              </div>
            </div>
            <div className="questions">
            {loading ?
            <ChakraProvider>
              <PostsLoading />
            </ChakraProvider> :
              <div className="question">
                {latest ? renderLatestPosts : renderTrendingPosts}
              </div>
}

            </div>
          </div>
        </div>
      </Container>
    </Home>
  )
}
