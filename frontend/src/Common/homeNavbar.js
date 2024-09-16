import React, { useContext, useEffect, useState } from 'react'
import logo from '../images/logo.png'
import logoDark from '../images/dark-logo2.png'
import { alpha, AppBar, Box, makeStyles, Typography, Dialog, DialogContent,  useTheme, useMediaQuery } from "@material-ui/core"
import { Toolbar } from '@mui/material';
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import Mail from '@mui/icons-material/Mail';
import Notifications from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import LockOpen from '@mui/icons-material/LockOpen';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useDispatch } from 'react-redux';
import { ChangePasswordAction, Logout } from "../Redux/Actions/authActions";
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Menu, MenuButton, MenuList, Button, MenuItem, ChakraProvider, Divider, Avatar, AvatarBadge, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import { HomeContext } from '../Context/HomeContext';
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import Passwordinput from '../Components/inputs/Password';
import i18next from 'i18next';
import classNames from 'classnames'
import SearchBar from '../Components/SearchBar';
import { getAll } from '../Redux/Actions/postsActions';
import { getAllCategories } from '../Redux/Actions/categoryAction';
import { DarkModeContext } from '../Context/darkModeContext';
import LightModeIcon from '@mui/icons-material/LightMode';

const useStyles = makeStyles((theme) => ({
  message: {
    cursor: 'pointer',
    "&:hover": {
      color: "rgb(52, 76, 105)"
    }
  },
  search: {
    display: "flex",
    alignItems: "center",
    marginLeft: '-150px',
    borderRadius: '20px',
    border: "1px solid #aaa7",
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },

    width: '50%',
  },

}));

function useQuery() {
  return new URLSearchParams(useLocation().search);
}


export default function HomeNavbar({ searchPost, handleKeyPress, search, setSearch, filteredData, setFilteredData }) {
  const classes = useStyles()
  const {darkMode} = useContext(DarkModeContext)
  const [form, setForm] = useState({});
  const errors = useSelector(state => state.errors)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { notification, socket, notifications, setNotifications, notificationChat, setNotificationChat, t, languages, currentLanguage, currentLanguageCode } = useContext(HomeContext)
  const auth = useSelector(state => state.auth)
  const { id } = useParams();
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { postsQuestions } = useSelector(state => state.all)
  const location = useLocation()
  const { dispatchMode } = useContext(DarkModeContext);
  const filteredPosts = postsQuestions.filter(post => post.category._id == id && post.isDraft===false)

  useEffect(() => {
    dispatch(getAll())
    dispatch(getAllCategories())
  }, [])


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onChangeHandler = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const ChangepasswordHandler = (e) => {
    e.preventDefault();
    dispatch(ChangePasswordAction(e, form))
  }

  const LogoutHandler = () => {
    dispatch(Logout())
  }


  const displayNotification = ({ sender, type }) => {
    let action;

    if (type === 1) {
      action = t("liked your post");
    } else if (type === 2) {
      action = t("bookmarked your post");
    } else if (type === 3) {
      action = t("commented on your post");
    }
    else if (type === 4) {
      action = t("upvoted your question");

    } else if (type === 5) {
      action = t("downvoted your question");
    }
    else if (type === 6) {
      action = t("commented on your answer");
    }
    else if (type === 7) {
      action = t("upvoted your answer");
    }
    else if (type === 8) {
      action = t("downvoted your answer");
    }
    else if (type === 9) {
      action = t("replied to your comment");
    }
    else if (type === 10) {
      action = t("mentioned you in a comment");
    }
    else if (type === 11) {
      action = t("answered your question");
    }
    else if (type === 12) {
      action = t("followed the category you created");
    }
    else if (type === 13) {
      action = t("commented on an answer on your question");
    }
    else {
      action = ".."
    }
    return (
      <span className="d-flex" style={{ color: 'black' }}>
        <ChakraProvider>
          <Avatar size='sm' p={0} name={sender.fullname} src={sender.pic} />
        </ChakraProvider>
        <div className='mt-1 mx-2'> {`${sender.fullname} ${action}`}</div>
      </span>
    );
  };


  return (
    <AppBar position='fixed'>
      <Toolbar className="d-flex justify-content-between backgroundColor-navbar">
        <Typography component={'div'} variant="h6" onClick={() => { navigate('/Home') }}>
          {darkMode ?
          <img style={{ cursor: 'pointer', marginRight: '200px', width: "90px", marginTop:'-10px' }} src={logoDark} alt='logo' />:
          <img style={{ cursor: 'pointer', marginRight: '200px', width: "75px" }} src={logo} alt='logo' />
          }
        </Typography>
          <SearchBar
            data={location.pathname === `/category/${id}/notes` || location.pathname === `/category/${id}/QA` ?  filteredPosts : postsQuestions}
            search={search}
            setSearch={setSearch}
            handleKeyPress={handleKeyPress} 
            searchPost={searchPost}
            filteredData={filteredData}
            setFilteredData={setFilteredData}
            />
        <div className="d-flex align-items-center">
          <ChakraProvider>
            <Menu >
            <MenuButton className={classes.message} mr={7} onClick={() => dispatchMode({ type: "TOGGLE" })}>
            {darkMode ? <DarkModeOutlinedIcon/> : <LightModeIcon/> }
              
            
          </MenuButton>
              <MenuButton
                className={classes.message}
                mx={5}
                onClick={() => {
                  navigate('/chats');
                  setNotificationChat(false)
                }}
              >
                <NotificationBadge
                  count={notificationChat ? notification.length : 0}
                  effect={Effect.SCALE}
                  style={{ width: '10px', height: '18px', paddingLeft: '4px', paddingRight: '10px' }}
                />
                <Mail />
              </MenuButton>
            </Menu>
            <Menu >
              <MenuButton className={classes.message} mx={8}>
                <NotificationBadge
                  count={notifications.length}
                  effect={Effect.SCALE}
                  style={{ width: '10px', height: '18px', paddingLeft: '4px', paddingRight: '10px' }}
                />
                <Notifications />
              </MenuButton>
              <MenuList pl={2}>
                {notifications.map((notif) => (
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      if (notif.post === 'post') {
                        navigate(`/post/${notif.postId}`)
                      }
                      else if (notif.post === 'question') {
                        navigate(`/Main-Question/${notif.postId}`)
                      }
                      else if (notif.post === 'category') {
                        navigate(`/category/${notif.postId}/notes`)
                      }
                      setNotifications(notifications.filter((n) => n !== notif));

                    }}
                  >
                    {displayNotification(notif)}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </ChakraProvider>
          <Box sx={{ flexGrow: 0 }}>
            <ChakraProvider>
              <Menu>
                <MenuButton> <Avatar p={0} name={auth.user.fullname} src={auth.user.pic} /></MenuButton>
                <MenuList className='text-secondary backgroundColor' >
                  <Box className="d-flex">
                    <Avatar name={auth.user.fullname} src={auth.user.pic} className='mx-3' >  <AvatarBadge bg='green.500' boxSize='1em' /></Avatar>
                    <div>
                      <h1 style={{ fontFamily: 'PT sans', fontSize: '15px' }} className='mt-2 text-secondary'>{auth.user.fullname}</h1>
                      <h6 style={{ fontFamily: 'Segoe UI', fontSize: '10px', color: 'gray', marginTop: '2px' }}>{auth.user.email}</h6>
                    </div>
                  </Box>
                  <Divider className='mt-3 mb-3' />

                  <MenuItem icon={<AccountCircle />} onClick={() => { navigate(`/Profile/${auth.user.id}`) }}>
                    Profile
                  </MenuItem>

                  <MenuItem icon={<LockOpen />} onClick={handleClickOpen} >
                    Manage Account
                  </MenuItem>
                  {/*<Modal size='full' isOpen={isOpen} onClose={onClose} >
                    <ModalOverlay />
                    <ModalContent className="mt-3 border p-5 bg-light" style={{ width: '50%', paddingBottom: '-20px' }} >
                      <ModalHeader >Change Password</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody pb={6} className="mt-3 border bg-light">

                        <div className='mx-5 mt-5'>
                          <form className=" bg-light ">
                            <FormControl isRequired>
                              <FormLabel>Old Password</FormLabel>
                              < Passwordinput
                                onKeyDown={onKeyPressForm}
                                name="old_password"
                                placeholder="Enter your old password"
                                icon="fa fa-key"
                                onChangeHandler={onChangeHandler}
                                errors={errors.old_password}
                              />
                            </FormControl>

                            <FormControl mt={4} isRequired>
                              <FormLabel>New Password</FormLabel>
                              <Passwordinput
                                onKeyDown={onKeyPressForm}
                                name="new_password"
                                placeholder="Enter your new password"
                                icon="fa fa-key"
                                onChangeHandler={onChangeHandler}
                                errors={errors.new_password}
                              />
                            </FormControl>

                            <FormControl mt={4} isRequired>
                              <FormLabel>Confirm New Password</FormLabel>
                              <Passwordinput
                                onKeyDown={onKeyPressForm}
                                name="confirm_password"
                                placeholder="Confirm your new password"
                                type="text"
                                icon="fa fa-key"
                                onChangeHandler={onChangeHandler}
                                errors={errors.confirm_password}
                              />
                            </FormControl>
                          </form>
                        </div>


                      </ModalBody>
                      <ModalFooter className="bg-light mt-5">
                        <Button size='md'
                          height='40px'
                          width='110px'
                          border='2px' colorScheme='pink' mr={3} onClick={ChangepasswordHandler}>
                          Save
                        </Button>
                        <Button size='md'
                          height='40px'
                          width='110px'
                          border='0px' onClick={onClose}>Cancel</Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>*/}
                  <Dialog
                    fullScreen={fullScreen}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="responsive-dialog-title"
                  >

                    <DialogContent style={{ paddingRight: '150px', backgroundColor:'#EAE4F1' }} className="border" >
                      <div style={{ fontWeight: '600', fontSize: '17px', color: '#3B285E' }}>{t('Change Password')}</div>
                      <div className='mx-3 mt-3'>
                        <form style={{backgroundColor:'#EAE4F1'}}>
                          <FormControl isRequired style={{ width: '360px' }}>
                            <FormLabel>{t('Old Password')}</FormLabel>
                            <Passwordinput
                              name="old_password"
                              placeholder={t("Enter your old password")}
                              icon="fa fa-key"
                              onChangeHandler={onChangeHandler}
                              errors={errors.old_password}
                              onKeyDown={() => { delete errors.old_password }}
                            />
                          </FormControl>

                          <FormControl mt={4} isRequired>
                            <FormLabel>{t('New Password')}</FormLabel>
                            <Passwordinput
                              name="new_password"
                              placeholder={t("Enter your new password")}
                              icon="fa fa-key"
                              onChangeHandler={onChangeHandler}
                              errors={errors.new_password}
                              onKeyDown={() => { delete errors.new_password }}


                            />
                          </FormControl>

                          <FormControl mt={4} isRequired>
                            <FormLabel>{t('Confirm New Password')}</FormLabel>
                            <Passwordinput
                              name="confirm_password"
                              placeholder={t("Confirm your new password")}
                              type="text"
                              icon="fa fa-key"
                              onChangeHandler={onChangeHandler}
                              errors={errors.confirm_password}
                              onKeyDown={() => { delete errors.confirm_password }}
                            />
                          </FormControl>
                          <div className="mt-4" style={{backgroundColor:'#EAE4F1'}}>
                            <Button size='md'
                              border='2px'
                              colorScheme='pink' 
                              mr={0} 
                              onClick={ChangepasswordHandler}>
                              {t('Save')}
                            </Button>

                          </div>
                        </form>

                      </div>

                      <FormControl fullWidth className='mt-4' >
                        <div style={{ fontWeight: '600', fontSize: '17px', color: '#3B285E' }}>{t('Change Language')}</div>
                        <ChakraProvider>
                          <div className="dropdown mt-2" style={{ marginLeft: '-15px' }}>
                            <button
                              className="btn dropdown-toggle"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              Language
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                              <li>
                                <span className="dropdown-item-text">{t('language')}</span>
                              </li>
                              {languages.map(({ code, name, country_code }) => (
                                <li key={country_code}>
                                  <a
                                    href="#"
                                    className={classNames('dropdown-item', {
                                      disabled: currentLanguageCode === code,
                                    })}
                                    onClick={() => {
                                      i18next.changeLanguage(code)
                                    }}
                                  >
                                    <span
                                      className={`flag-icon flag-icon-${country_code} mx-2`}
                                      style={{
                                        opacity: currentLanguageCode === code ? 0.5 : 1,
                                      }}
                                    ></span>
                                    {name}
                                  </a>
                                </li>
                              ))}
                            </div>
                          </div>
                        </ChakraProvider>

                      </FormControl>

                    </DialogContent>

                  </Dialog>
                  <Divider className='mt-2 mb-2' />
                  <MenuItem icon={<LogoutIcon />} onClick={LogoutHandler} >
                    {t('Logout')}
                  </MenuItem>

                </MenuList>
              </Menu>
            </ChakraProvider>

          </Box>
        </div>
      </Toolbar>
    </AppBar>
  )
}

