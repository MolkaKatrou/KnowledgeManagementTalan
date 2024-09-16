import {GET_QUESTION,DELETE_QUESTION,BOOKMARK_QUESTION, GET_QUESTIONS, VOTE_UP, UPDATE_QUESTION,
   VOTE_DOWN, ERRORS,GET_ANSWERS,UPDATE_ANSWER,DELETE_COMMENT, VOTE_UP_ANSWER, VOTE_DOWN_ANSWER, DELETE_ANSWER, CREATE_COMMENT, FETCH_BY_SEARCH} from '../types'
import axios from 'axios'

export const getAllQuestions = () => async dispatch => { 
    try{      
        const {data} = await axios.get('/Api/questions')
        dispatch( {
            type: GET_QUESTIONS,
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

export const getQuestion = (id) => async dispatch => {
    try {  
      const {data} = await axios.get(`/Api/questions/${id}`)
      dispatch({ 
            type: GET_QUESTION, 
            payload: { question: data }
    });
    } catch (error) {
        dispatch({
            type: ERRORS,
            payload: error,
        })
    }
  };

export const createQuestion = (question) => async (dispatch) => {
  try {
    const { data } = await axios.post('/Api/questions', question);   
  } catch (error) { 
    dispatch({
        type: ERRORS,
        payload: error,
       
    })
}
};

export const deleteQuestion = (id) => async (dispatch) => {
  try {
    await axios.delete(`/Api/questions/${id}`);
    dispatch({ type: DELETE_QUESTION, payload: id });
  } catch (error) {
    console.log(error);
  }
};

export const updateQuestion = (id, question) => async (dispatch) => {
  try {
    const { data } = await axios.patch(`/Api/questions/${id}`, question);
    dispatch({ type: UPDATE_QUESTION, payload: data });
  } 
  catch (error) {
    console.log(error);
  }
};


export const UpVoteQuestion = (id) => async dispatch => {
  try {
    const token = JSON.parse(localStorage.getItem('jwt')).split(" ")[1]
    const { data } = await axios.patch(`/Api/questions/${id}/voteup`, token)
    dispatch({ type: VOTE_UP, payload: data });
    dispatch(getAllQuestions());
    }
   catch (error) {
    console.log(error.message);
  }
};

export const DownVoteQuestion = (id) => async dispatch => {
  try {
    const token = JSON.parse(localStorage.getItem('jwt')).split(" ")[1]
    const { data } = await axios.patch(`/Api/questions/${id}/votedown`, token)
    dispatch({ type: VOTE_DOWN, payload: data });
    dispatch(getAllQuestions());
    }
   catch (error) {
    console.log(error.message);
  }
};

export const BookmarkQuestion = (id) => async dispatch => {
  try {
    const token = JSON.parse(localStorage.getItem('jwt')).split(" ")[1]
    const { data } = await axios.patch(`/Api/questions/${id}/bookmark`, token)
    dispatch({ type: BOOKMARK_QUESTION, payload: data });
    dispatch(getAllQuestions());
  } catch (error) {
    console.log(error.message);
  }
};

export const getAllAnswers = () => async dispatch => {    
  try{      
      const {data} = await axios.get('/Api/answers')
      dispatch( {
          type: GET_ANSWERS,
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



export const createAnswer = (question) => async (dispatch) => {
try {
  const { data } = await axios.post('/Api/answers', question);   
} catch (error) { 
  dispatch({
      type: ERRORS,
      payload: error,
     
  })
}
};

export const deleteAnswer = (id) => async (dispatch) => {
try {
  await axios.delete(`/Api/answers/${id}`);
  dispatch({ type: DELETE_ANSWER, payload: id });
} catch (error) {
  console.log(error);
}
};

export const updateAnswer = (id, answer) => async (dispatch) => {
  try {
    const { data } = await axios.patch(`/Api/answers/${id}`, answer);
    dispatch({ type: UPDATE_ANSWER, payload: data });
  } 
  catch (error) {
    console.log(error);
  }
};

export const deleteAnswerComment = (id) => async (dispatch) => {
  try {
    await axios.delete(`/Api/answers/${id}/comment/${id}`);
    dispatch({ type: DELETE_COMMENT, payload: id });
  } catch (error) {
    console.log(error);
  }
  };

export const UpVoteAnswer = (id) => async dispatch => {
try {
  const token = JSON.parse(localStorage.getItem('jwt')).split(" ")[1]
  const { data } = await axios.patch(`/Api/answers/${id}/voteup`, token)
  dispatch({ type: VOTE_UP_ANSWER, payload: data });
  dispatch(getAllAnswers());
  
  }
 catch (error) {
  console.log(error.message);
}
};

export const DownVoteAnswer = (id) => async dispatch => {
try {
  const token = JSON.parse(localStorage.getItem('jwt')).split(" ")[1]
  const { data } = await axios.patch(`/Api/answers/${id}/votedown`, token)
  dispatch({ type: VOTE_DOWN_ANSWER, payload: data });
  dispatch(getAllAnswers());
  }
 catch (error) {
  console.log(error.message);
}
};

export const getPostsBySearch = (searchQuery) => async (dispatch) => {
  try {
    const res = await axios.get(`/Api/search?searchQuery=${searchQuery.search || 'none'}`)
    console.log(res.data)
    dispatch({ type: FETCH_BY_SEARCH, payload: { data: res.data } });
  } catch (error) {
    console.log(error);
  }
};

export const CommentAnswer =(value,id) => async dispatch =>{
  try {
      const {data}= await axios.post(`/Api/answers/${id}/comment`, value )
      dispatch({type: CREATE_COMMENT,payload: id});
      dispatch(getAllAnswers())
  } catch (error) {
      console.log(error);
  } 
}
