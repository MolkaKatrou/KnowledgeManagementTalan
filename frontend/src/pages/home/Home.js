import React, { useContext, useEffect, useState } from 'react'
import { Box, Grid, makeStyles } from "@material-ui/core"
import HomeNavbar from '../../Common/homeNavbar';
import Sidebar from '../../Common/Sidebar';
import AddNote from './AddNote';
import Rightbar from '../../Common/Rightbar';
import { useSelector } from 'react-redux';
import { CategoryContext } from '../../Context/CategoryContext';
import { getAllPosts, getPostsBySearch } from '../../Redux/Actions/postsActions';
import { getAllQuestions } from '../../Redux/Actions/questionsActions';
import { HomeContext } from '../../Context/HomeContext';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

const useStyles = makeStyles((theme) => ({
  container: {
      paddingTop: theme.spacing(8),
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

const Home = ({ children }) => {
  const query = useQuery();
  const [categoryId, setCategoryId] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [updateCategory, setUpdateCategory] = useState(false)
  const [parentCategoryIdName, setParentCategoryIdName] = useState('')
  const [categoryIdName, setCategoryIdName] = useState('')
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()
  const [filteredData, setFilteredData] = useState([]);
  const { dispatch, search, setSearch, setLoading, loading } = useContext(HomeContext)
  const location = useLocation()
  const classes=useStyles()


  const auth = useSelector(state => state.auth)
  const user = {
    isConnected: auth.isConnected,
    role: auth.user.role
  }



  const searchPost = async () => {
    if (search.trim()) {
      dispatch(getPostsBySearch({ search }, setLoading));
      if (location.pathname === '/Home') {
        navigate(`/Home/search?searchQuery=${search || 'none'}`);
      }

      else if (location.pathname === '/Bookmarks') {
        navigate(`/Bookmarks/search?searchQuery=${search || 'none'}`);
      }
      else if (location.pathname === '/Drafts') {
        navigate(`/Drafts/search?searchQuery=${search || 'none'}`);
      }
      else if (location.pathname === `/category/${id}/notes`) {
        navigate(`/category/${id}/notes/search?searchQuery=${search || 'none'}`);

      }
      else if (location.pathname === `/category/${id}/QA`) {
        navigate(`/category/${id}/QA/search?searchQuery=${search || 'none'}`);
      }
      else {
        navigate(`/Home/search?searchQuery=${search || 'none'}`);
      }

    }
    else {
      if (location.pathname === `/Bookmarks/search`) {
        navigate('/Bookmarks');
        dispatch(getAllPosts(setLoading))
        dispatch(getAllQuestions(setLoading))
      }
      else if (location.pathname === `/Drafts/search`) {
        navigate('/Drafts');
        dispatch(getAllPosts(setLoading))
        dispatch(getAllQuestions(setLoading))

      }
      else if (location.pathname === `/category/${id}/notes/search`) {
        navigate(`/category/${id}/notes`);
        dispatch(getAllPosts(setLoading))
        dispatch(getAllQuestions(setLoading))

      }
      else if (location.pathname === `/category/${id}/QA/search`) {
        navigate(`/category/${id}/QA`);
        dispatch(getAllPosts(setLoading))
        dispatch(getAllQuestions(setLoading))

      }
      else {
        navigate('/Home');
        dispatch(getAllPosts(setLoading))
        dispatch(getAllQuestions(setLoading))
      }


    }
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      searchPost();
      setFilteredData([])
    }
  };


  useEffect(() => {
    setLoading(false)
  }, [])

  return (

    <CategoryContext.Provider value={{ categoryId, categoryIdName, setCategoryIdName, parentCategoryIdName, setParentCategoryIdName, setCategoryId, setUpdateCategory, updateCategory, anchorEl, setAnchorEl, open, setOpen }}>
      <HomeNavbar 
        handleKeyPress={handleKeyPress}
        searchPost={searchPost}
        search={search}
        filteredData={filteredData}
        setFilteredData={setFilteredData}

      />
      {location.pathname !== '/chats' ?
        <Grid container style={{ height: '100vh' }}>
          <Grid item sm={2} xs={2} >
            <Sidebar user={user} />
          </Grid>
          <Grid item sm={7} xs={10}>
            {children}
          </Grid>
          <Grid item sm={3} className="d-none d-sm-block">
            <Rightbar />
          </Grid>
        </Grid> :

        <Grid container style={{ height: '100vh' }}>
          <Grid item sm={2} xs={2} >
            <Sidebar user={user} />
          </Grid>
          <Grid item sm={10} xs={10} className={`${classes.container} backgroundColor`}>
            <Box className='d-flex justify-content-between' style={{ padding: '10px', height: '100%', width: "100%" }}>        
                {children}
            </Box>
          </Grid>
        </Grid>
      }
       {location.pathname !== '/chats' ?<AddNote /> : ''}
    </CategoryContext.Provider>

  )
}

export default Home