import { Alert } from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../Common/Navbar'
import Passwordinput from '../Components/inputs/Password'
import { HomeContext } from '../Context/HomeContext'
import styles from "./styles.module.css";

function Resetpassword() {
    const {t} = useContext(HomeContext)
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const {token}=useParams()
    const [errors, setErrors] = useState({});
    const [show, setShow] = useState(false);
    const [validUrl, setValidUrl] = useState(true);

    
        const changePassword = (e)=>{
            e.preventDefault();
            axios.post('/Api/resetpassword', {password: password , confirm:confirm, token: token})
            .then(res=>{ 
                setErrors({})
                setShow(true)
                setTimeout(() => {
                    setShow(false)
                }, 3000);              
            })
            .catch(err=>setErrors(err.response.data))            
        }

    return (
        <>
          <Navbar />
  
          <div className={`${styles.container} backgroundColor`} style={{paddingTop:'20px', height:'87.5vh'}}>
            <div className='main h-100 w-100' >
                <div className='container h-100' >
                    <div className='row h-100'>
                        <div className='col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100 background-reset'>
                            <div className='d-table-cell align-middle'>
                            {show ? <Alert severity="success">{t('Your password has been successfully reset!')}</Alert> : ""}
                            {errors.expired ? <Alert severity="error">{errors.expired}</Alert> : ""}

                                <div className='text-center mt-5'>
                                    <h1 className='h2 login-h2' style={{fontWeight:'600' }}>{t('Password Reset')}</h1>
                                </div>

                                <div className='card mt-4 background-reset' >
                                    <div className='card-body'>
                                        <div className='m-sm-4'>
                                            <form className='p-5' onSubmit={changePassword}>

                                                <Passwordinput
                                                    name="password"
                                                    placeholder={t("Enter your new password")}
                                                    icon="fa fa-key"
                                                    onChangeHandler={(e)=>setPassword(e.target.value)}
                                                    onKeyDown={()=> {delete errors.password}}
                                                />
                                                <div className='mt-4'>
                                                    <Passwordinput
                                                        name="confirm"
                                                        placeholder={t("Confirm your new password")}
                                                        icon="fa fa-key"
                                                        onChangeHandler={(e)=>setConfirm(e.target.value)}
                                                        errors={errors.confirm}
                                                        onKeyDown={()=> {delete errors.confirm}}
                                                    />
                                                </div>


                                                <div className='text-center mt-3 p-3'>
                                                    <button type="submit" className='button btn-login'>{t('Reset Password')}</button>
                                                </div>
                                            </form>

                                        </div>
                                    </div>

                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
                     
        </>
    )
}

export default Resetpassword