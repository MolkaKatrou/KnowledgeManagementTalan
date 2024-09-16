import axios from 'axios';
import { ERRORS, SET_USER, GET_USERS, UPDATE_USER } from '../types';
import jwt_decode from 'jwt-decode';
import { setAuth } from '../../utils/setAuth';
import toast from 'react-hot-toast';


export const AddProfile = (form, setShow, setMessage, e)=>dispatch=>{
    axios
      .post("/Api/users", form)
      .then(res => {
        setShow(true)
        const {message} = res.data
        console.log(message)
        setMessage("User added with success")
        e.target.reset();
        setTimeout(() => {
            setShow(false)
        }, 4000);   
        if (message)   {
            dispatch({
                type: ERRORS,
                payload: {}
            })
        }
      })
    

      .catch(err => {
          dispatch({
              type: ERRORS,
              payload: err.response.data
          })
      });
}

export const LoginAction = (form)=>dispatch=>{
    axios.post('/Api/login', form) 
    .then(res=>{
      const {token} = res.data
      const {user} = res.data
      localStorage?.setItem('jwt', JSON.stringify(token))
      localStorage?.setItem('user', JSON.stringify(user))
      dispatch(setUser(user))
      setAuth(token)
    })
    
    .catch(err=>{
        dispatch({
            type: ERRORS,
            payload: err.response.data
        })
    })
}

export const LoginVerify = (form, setShowVerified)=>dispatch=>{
    axios.post('/Api/loginVerify', form) 
    .then(res=>{
      const {token} = res.data
      const {user} = res.data
      localStorage?.setItem('jwt', JSON.stringify(token))
      localStorage?.setItem('user', JSON.stringify(user))
      dispatch(setUser(user))
      setAuth(token)
      setShowVerified(true)
      setTimeout(() => {
          setShowVerified(false)
      }, 4000);              
      if (token){
        dispatch({
            type: ERRORS,
            payload: {}
        })
    }
    })  
    .catch(err=>{
        dispatch({
            type: ERRORS,
            payload: err.response.data
        })
    })
}

export const ChangePasswordAction = (e,form)=>dispatch=>{
    axios.post('/Api/changepassword', form) 
    .then(res=>{
      if (JSON.stringify(res.data.message)){
        toast.success('Your password is successfully updated')
        dispatch({
            type: ERRORS,
            payload: {}
        })}
    })
    .catch(error=>{
        dispatch({
            type: ERRORS,
            payload: error.response.data
        })
    })
}

export const Logout = ()=>dispatch=>{
    localStorage.removeItem('jwt')
    dispatch({
        type: SET_USER,
        payload: {}
    })
} 

export const setUser = (decode)=>({
    type: SET_USER,
    payload: decode
})

export const UpdateUser = (pic)=>({
    type: UPDATE_USER,
    payload: pic
})

export const getAllUsers = () => async dispatch => {    
    try{      
        const {data} = await axios.get('/Api/users')
        dispatch( {
            type: GET_USERS,
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