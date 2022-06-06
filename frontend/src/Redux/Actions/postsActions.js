import {GET_POSTS, GET_POST,CREATE_POST, UPDATE_POST, DELETE_POST, LIKE, BOOKMARK,FETCH_BY_SEARCH, ERRORS} from '../types'
import axios from 'axios'

axios.interceptors.request.use((req) => {
    if (localStorage.getItem('jwt')) {
      req.headers.Authorization = JSON.parse(localStorage.getItem('jwt'));
    } 
    return req;
  });

export const getAllPosts = () => async dispatch => {    
    try{      
        const {data} = await axios.get('/Api/notes')
        dispatch( {
            type: GET_POSTS,
            payload: {data}
        })
    }
    catch(error){
        dispatch( {
            type: ERRORS,
            payload: error,
        })
    }
}

export const getPost = (id) => async dispatch => {
    try {  
      const {data} = await axios.get(`/Api/notes/${id}`)
      dispatch({ 
            type: GET_POST, 
            payload: { post: data }
    });
    } catch (error) {
        dispatch({
            type: ERRORS,
            payload: error,
        })
    }
  };
  

export const commentPost =(value,id) => async dispatch =>{
    try {
        const {data}= await axios.post(`/Api/notes/${id}/comment`, value )
        console.log(data)
    } catch (error) {
        console.log(error);
    } 
}

export const likePost = (id) => async dispatch => {
    try {
      const token = JSON.parse(localStorage.getItem('jwt')).split(" ")[1]
      const { data } = await axios.patch(`/Api/notes/${id}/like`, token)
      dispatch({ type: LIKE, payload: data });
      }
     catch (error) {
      console.log(error.message);
    }
};

export const BookmarkPost = (id) => async dispatch => {
    try {
      const token = JSON.parse(localStorage.getItem('jwt')).split(" ")[1]
      const { data } = await axios.patch(`/Api/notes/${id}/bookmark`, token)
      dispatch({ type: BOOKMARK, payload: data });
      dispatch(getAllPosts);
    } catch (error) {
      console.log(error.message);
    }
};

export const getPostsBySearch = (searchQuery) => async (dispatch) => {
  try {
    const res  = await axios.get(`/Api/search?searchQuery=${searchQuery.search || 'none'}`)
    dispatch({ type: FETCH_BY_SEARCH, payload: {data : res.data } });
  } catch (error) {
    console.log(error);
  }
};

export const createPost = (post) => async (dispatch) => {
  try {
    const { data } = await axios.post('/Api/notes', post);
    dispatch({ type: CREATE_POST, payload: data });
    
  } catch (error) { 
    dispatch({
        type: ERRORS,
        payload: error,
       
    })
}
};

export const deletePost = (id) => async (dispatch) => {
  try {
    await axios.delete(`/Api/notes/${id}`);
    dispatch({ type: DELETE_POST, payload: id });
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = (id, post) => async (dispatch) => {
  try {
    const { data } = await axios.patch(`/Api/notes/${id}`, post);
    dispatch({ type: UPDATE_POST, payload: data });
  } 
  catch (error) {
    console.log(error);
  }
};
