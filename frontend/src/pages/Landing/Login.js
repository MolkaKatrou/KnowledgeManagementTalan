import React, { useState, useContext } from 'react';
import bg from '../../images/login.png';
import logo from '../../images/logo2.png'
import logoDark from '../../images/dark-logo.png'
import "../../assets/Login.css";
import Navbar from '../../Common/Navbar';
import Logininput from '../../Components/inputs/Logininput';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { LoginAction } from '../../Redux/Actions/authActions';
import Passwordinput from '../../Components/inputs/Password';
import { HomeContext } from '../../Context/HomeContext';
import { Alert } from '@mui/material';
import { ChakraProvider } from '@chakra-ui/react';
import { DarkModeContext } from '../../Context/darkModeContext';


export default function Login() {
  const {t, socket, setSocketConnected} = useContext(HomeContext)
  const [form, setForm] = useState({});
  const dispatch = useDispatch()
  const errors = useSelector(state=>state.errors)
  const [type, setType] = useState("password");
  const {darkMode}= useContext(DarkModeContext)

  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });  
  };

  const onSubmit = (e) => {
    e.preventDefault()
    dispatch(LoginAction(form))
  }

  return (
    <>
      <Navbar />
      <section className="login-container backgroundColor">
        <div className="login-wrapper">
          <div className='left-login'>
            <img src={bg} />
            <h2 className='login-h2'>{t('Welcome To Our Knowledge Management Platform')}  </h2>
            <h3 className='dark'> {t('Increase productivity, social interaction, and trust among the team')} </h3>
          </div>
          <div className='form-login'>
            <form onSubmit={onSubmit} >
        
              <div className='heading1'>
              {darkMode ?
                 <img src={logoDark} style={{ marginLeft: "-2px", width: "190px" }} alt='login' /> :
                 <img src={logo} style={{ marginLeft: "-65px", width: "350px" }} alt='login' />
                }
              </div>
              <div className='heading2'>
              <i className="fa fa-users fa-6x"  aria-hidden="true"></i>
                

              </div>
              <Logininput
                type="text"
                name="email"
                placeholder={t("Enter your email")} 
                icon="fa fa-at"
                onChangeHandler={onChange}
                errors={errors.email}
                onKeyDown={()=> {delete errors.email}}

              />
              < Passwordinput
                type={type}
                name="password"
                placeholder={t("Enter your password")} 
                onChangeHandler={onChange}
                errors={errors.password}
                icon="fa fa-key"
                onKeyDown={()=> {delete errors.password}}
              />


              <div className='form-input'>
                <button type="submit" className='button btn-login'>{t('Login')}</button>
                <h6 style={{color:'grey'}}> {t('forgot your password?')}  
                  <Link to='/forgotpassword' style={{ textDecoration: 'none', fontFamily:'PT Sans' }} > {t('Reset it')} </Link>
                  </h6>
                {errors.isVerified && <Alert severity="error"> {errors.isVerified}</Alert>}
              </div>

            </form>
          </div>
        </div>
      </section>
    </>
  )
}

