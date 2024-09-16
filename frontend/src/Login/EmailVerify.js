import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";
import Navbar from "../Common/Navbar";
import Passwordinput from "../Components/inputs/Password";
import { HomeContext } from "../Context/HomeContext";
import { Alert } from "@mui/material";
import { LoginAction, LoginVerify } from "../Redux/Actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import { Button, ChakraProvider } from "@chakra-ui/react";

const EmailVerify = () => {
    const dispatch = useDispatch()
    const [validUrl, setValidUrl] = useState(true);
    const { token } = useParams();
    const { t, setShowVerified } = useContext(HomeContext)
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [email, setEmail] = useState("")
    const [firstname, setFirstname] = useState("")
    const errors = useSelector(state => state.errors)


    const changePassword = (e) => {
        e.preventDefault();
        dispatch(LoginVerify({ email: email, password: password, confirm: confirm }, setShowVerified))
    }
    const verifyEmailUrl = async () => {
        axios
            .get(`/Api/verify/${token}`)
            .then(res => {
                setValidUrl(true);
                setEmail(res.data.email)
                setFirstname(res.data.firstname)
            })
            .catch(err => {
                setValidUrl(false)
                console.log(err)
            });
    }


    useEffect(() => {
        verifyEmailUrl();
    }, []);

    return (
        <>
            <Navbar />
        {validUrl ? (
            <div className={`${styles.container} backgroundColor`} style={{height:'87.6vh'}}>
                <div className='main h-100 w-100' >
                    <div className='container h-100' >
                        <div className='row h-100'>
                            <div className='col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100'>
                                <div className='d-table-cell align-middle'>
                                    <Alert variant="filled" severity="success">
                                        {t(`Welcome`)} {`${firstname}`}, {t('Change your password for your account to be verified!')}
                                    </Alert>
                                    <div className='text-center mt-5'>
                                        <h1 className='h2' style={{ color: 'rgb(8, 8, 126)',fontFamily:'PT Sans', fontWeight:'600' }}>{t('Set Your Password')}</h1>
                                    </div>

                                    <div className='card mt-4' style={{backgroundColor:'#dfdfe9'}}>
                                        <div className='card-body'>
                                            <div className='m-sm-4'>
                                              <form className='p-5' onSubmit={changePassword}>
                                                    <Passwordinput
                                                        name="password"
                                                        placeholder={t("Enter your password")}
                                                        icon="fa fa-key"
                                                        onChangeHandler={(e) => setPassword(e.target.value)}
                                                        errors={errors.password}
                                                        onKeyDown={()=> {delete errors.password}}
                                                    />
                                                    <div className='mt-5'>
                                                        <Passwordinput
                                                            name="confirm"
                                                            placeholder={t("Confirm your password")}
                                                            icon="fa fa-key"
                                                            onChangeHandler={(e) => setConfirm(e.target.value)}
                                                            errors={errors.confirm}
                                                            onKeyDown={()=> {delete errors.confirm}}
                                                        />
                                                    </div>
                                                    <div className='text-center mt-5'>
                                                        <ChakraProvider>
                                                            <Button
                                                                style={{ color: 'black', padding: '10px 50px', borderRadius: '20x', fontSize: 'bold' }}
                                                                className={styles.green_btn}
                                                                colorScheme='teal'
                                                                onClick={changePassword}
                                                            >
                                                                Login
                                                            </Button>
                                                        </ChakraProvider>
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
            ) : (
                <div className={styles.container} style={{paddingTop:'576px'}}>
                     
                    <h1 style={{marginTop:'-800px'}}>404 Not Found</h1>
                    
                </div>
           )}
        </>
    );
};

export default EmailVerify;