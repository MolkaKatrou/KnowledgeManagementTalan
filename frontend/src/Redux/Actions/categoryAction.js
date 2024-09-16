import {GET_CATEGORIES, FOLLOW, CREATE_CATEGORY, ERRORS} from '../types'
import axios from 'axios'

export const getAllCategories = () => async dispatch => {    
    try{
        const res = await axios.get('/Api/categories')
        dispatch( {
            type: GET_CATEGORIES,
            payload: res.data
        })
    }
    catch(error){
        dispatch( {
            type: ERRORS,
            payload: error,
        })
    }

}

export const updateCategories = (formcategory) => async dispatch => {
        const res = axios.post('/Api/categories/update', formcategory);
    }


export const createCategory = (form) => async dispatch => {
    try  {
        const res = axios.post('/Api/categories', form);
        dispatch( {
            type: CREATE_CATEGORY,
            payload: res.data
        })
    }
        catch(error){
            console.log(error.response.data)
        }
    }




export const FollowCategory = (id) => async dispatch => {
    try {
      const token = JSON.parse(localStorage.getItem('jwt')).split(" ")[1]
      const { data } = await axios.patch(`/Api/categories/${id}/follow`, token)
      dispatch({ type: FOLLOW, payload: data });
      dispatch(getAllCategories())
    } catch (error) {
      console.log(error.message);
    }
};


