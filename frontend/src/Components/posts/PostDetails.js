import {CircularProgress, Container, makeStyles, Grid } from "@material-ui/core";
import React, { useEffect, useState, useContext } from "react";
import { getAllPosts } from "../../Redux/Actions/postsActions";
import Home from "../../pages/home/Home";
import { useDispatch, useSelector } from "react-redux";
import {useParams } from "react-router-dom";
import { HomeContext } from "../../Context/HomeContext";
import MainPost from "./MainPost";


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
function PostDetails() {
  const{liked} = useContext(HomeContext)
  const { id } = useParams()
  const classes = useStyles()
  const {posts, loading } = useSelector((state) => state.posts);
  const post = posts.filter((post) => post._id === id  && post.isDraft===false)
  const [likes, setLikes] = useState([]);
  const auth = useSelector(state => state.auth)
  const userId = auth.user.id
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getAllPosts())
  },[liked])


  if (!post) {
    return (
      <Home>
        <Container className={classes.container}>
          <CircularProgress size="3em" elevation={4} className={classes.loadingPaper} />
        </Container>
      </Home>

    )
  }
  return (
    <Home>
      <Container className={`${classes.container} backgroundColor`}>
        {loading ?

          <CircularProgress size="1em" elevation={2} className={classes.loadingPaper} />
          :

          post.map((post, index) => (
            <Grid key={post._id}>
              <MainPost post={post} />
            </Grid>
          ))
        }
      </Container>
    </Home>
  );
}

export default PostDetails;