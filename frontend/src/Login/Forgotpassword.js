import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../Common/Navbar'
import axios from 'axios'
import AdminInput from '../Components/inputs/AdminInput'
import Alert from '@mui/material/Alert';
import { HomeContext } from '../Context/HomeContext'
import styles from "./styles.module.css";



function Forgotpassword() {
    const {t} = useContext(HomeContext)
    const [email, setEmail] = useState({});
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState({});
    const [show, setShow] = useState(false);

    function onChangeHandler(e) {
        setEmail({
            ...email,
            [e.target.name]: e.target.value,
          });
        };

    const PostEmail = (e)=>{
        e.preventDefault();
        axios.post('/Api/forgotpassword', email)
        .then(res=>{ 
            setSuccess(res.data)
            setShow(true)
            setErrors({})
            setTimeout(() => {
                setShow(false)
            }, 3000);
          
        })
        .catch(err=>setErrors(err.response.data))
    }
       
  

    return (
        <>
        <Navbar/>
        <div className={`${styles.container} backgroundColor`} style={{paddingTop:'20px', height:'87.6vh'}}>
        <div className='main h-100 w-100' >
            <div className='container h-100' >
                <div className='row h-100'>
                    <div className='col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100 background-reset' style={{marginTop:'-80px'}}>
                        <div className='d-table-cell align-middle' >
                        { show ? <Alert severity="success">{t('We sent you the link — Check your Email!')}</Alert> : ""}
                            <div className='text-center mt-5'>
                                <h1 className='h2 login-h2' style={{fontFamily:'PT Sans', fontWeight:'600'}}>{t('Password Reset')}</h1>
                                <p   style={{color:'grey', fontFamily:'PT Sans'}}> {t('Enter your email to reset your password')}</p>
                            </div>
                      
                            <div className='card mt-5 background-reset' >
                                <div className='card-body'>
                                    <div className='m-sm-4'>
                                        <form onSubmit={PostEmail}>
                                            <AdminInput
                                                label="Email"
                                                labelclass="form-label mb-4"
                                                type="text"
                                                name="email"
                                                icon="fa fa-envelope"
                                                onChangeHandler={onChangeHandler}
                                                errors={errors.email}
                                                onKeyDown={()=> {delete errors.email}}
                                               
                                            />
                                            <div className='text-center mt-5 p-3'>
                                            <button type="submit" className='button btn-login' >{t('Reset Password')}</button>
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

export default Forgotpassword