import './App.css';
import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Redirect, Privaterouter } from './Login/privateRouter';
import { Logout, setUser } from './Redux/Actions/authActions';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from './utils/setAuth';
import List from "./pages/admin/list/users";
import New from "./pages/admin/new/newUser";
import Categorynew from "./pages/admin/new/newCategory";
import SingleCategory from "./pages/admin/single/singleCategory"
import CategoryDetails from "./pages/admin/CategoryDetails"
import Landing from './pages/Landing/Landing';
import About from "./pages/Landing/About";
import Login from './pages//Landing/Login';
import AdminPanel from './pages/admin/AdminPanel';
import Details from './pages/admin/UserDetails';
import NotFound from './pages/Error/NotFound';
import NoAccess from './pages/Error/NoAccess';
import Adminrouter from './Login/Adminrouter';
import Forgotpassword from './Login/Forgotpassword';
import jwt_decode from 'jwt-decode';
import store from './Redux/store'
import Resetpassword from './Login/Resetpassword';
import CategoryNotes from './pages/home/CategoryNotes';
import Feed from './pages/home/Feed';
import Bookmark from './pages/home/Bookmark';
import PostDetails from './Components/posts/PostDetails';
import CategoryQA from './pages/home/CategoryQ&A';
import { HomeContext } from './Context/HomeContext';
import AddQuestion from './pages/home/AddQuestion';
import MainQuestion from './Components/Questions&Answers/MainQuestion';
import Chats from './pages/home/Chats';
import io from "socket.io-client";
import Profile from './pages/home/Profile';
import { Toaster } from 'react-hot-toast';
import Drafts from './pages/home/Drafts';
import { useTranslation } from 'react-i18next'
import cookies from 'js-cookie'
import Category from './pages/admin/list/categories';
import Single from './pages/admin/single/singleUser';
import "./dark.scss";
import { DarkModeContext } from './Context/darkModeContext';
import EmailVerify from './Login/EmailVerify';

const languages = [
  {
    code: 'fr',
    name: 'Français',
    country_code: 'fr',
  },
  {
    code: 'en',
    name: 'English',
    country_code: 'gb',
  },
]

if (window.localStorage.user && window.localStorage.jwt) {
  const decode = jwt_decode(window.localStorage.jwt)
  const user = JSON.parse(localStorage.getItem('user'))
  store.dispatch(setUser(user))
  setAuth(window.localStorage.jwt)
  const currentDate = Date.now / 1000
  if (decode.exp > currentDate) {
    store.dispatch(Logout())
  }
}

const ENDPOINT = "http://localhost:4000";
var socket

function App() {
  const [notifications, setNotifications] = useState([]);
  const [showVerified, setShowVerified] = useState(false)
  const [newNotifications, setNewNotifications] = useState([]);
  const [currentId, setCurrentId] = useState(0);
  const [openNote, setOpenNote] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [liked, setLiked] = useState('false');
  const [loading, setLoading] = useState('false')
  const [search, setSearch] = useState('');
  const [followers, setFollowers] = useState([])
  const [selectedChat, setSelectedChat] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();
  const [notificationChat, setNotificationChat] = useState(false)
  const [socketConnected, setSocketConnected] = useState(false);
  const dispatch = useDispatch()
  const token = JSON.parse(localStorage?.getItem('jwt'))?.split(" ")[1]
  const auth = useSelector(state => state.auth)
  socket = io(ENDPOINT);
  const [fetchAgain, setFetchAgain] = useState(false)
  const notificationsRef = React.createRef();
  const [currentQuestionId, setCurrentQuestionId] = useState(0);
  const [fetch, setFetch] = useState(false)
  const [replyId, setReplyId] = useState('')

  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()

  
  const { darkMode } = useContext(DarkModeContext); 

  const user = {
    isConnected: auth.isConnected,
    role: auth.user.role
  }

  useEffect(() => {
    document.body.dir = currentLanguage.dir || 'ltr'
    document.title = t('app_title')
  }, [currentLanguage, t])



  useEffect(() => {
    socket.emit("setup", auth.user);
    socket.on('connected', () => setSocketConnected(true))
  }, [])



  useEffect(() => {
    notificationsRef.current = notifications;
    socket.on("getNotification", (data) => {
      setNotifications((prev) => [...prev, data]);
    });
  });


  return (
    <HomeContext.Provider
      value={{
        socket, fetchAgain, setFetchAgain, notifications, setNotifications,
        socketConnected, setSocketConnected,loading, setLoading,
        token, dispatch, openNote, liked, setLiked, search, setSearch,
        followers, setFollowers, setOpenNote, showAlert, setShowAlert, currentId, setCurrentId,
        selectedChat, setSelectedChat, notification, setNotification, chats, setChats,
        notificationChat, setNotificationChat, openModal, setOpenModal, currentQuestionId, setCurrentQuestionId,
        t, languages, currentLanguage, currentLanguageCode,fetch, setFetch,
        replyId, setReplyId, showVerified, setShowVerified
      }}>
      <Toaster
        toastOptions={{
          success: { style: { color: 'white', backgroundColor: '#89CA97' }, },
          error: { style: { color: 'white', backgroundColor: '#CF933A' }, },
        }} />
    <div className={darkMode ? "app dark" : "app"}>
      <Router>
        <Routes>
          <Route path="/" element={<Redirect user={user}><Landing /></Redirect>} />
          <Route path="/about" element={<Redirect user={user}><About /></Redirect>} />
          <Route path="/login" element={<Redirect user={user}><Login /></Redirect>} />
          <Route path="/user/verify-email/:token" element={<Redirect user={user}><EmailVerify/></Redirect>} />

          <Route path="/admin" element={<Adminrouter user={user}><AdminPanel /></Adminrouter>} />
          <Route path="/users">
            <Route index element={<Adminrouter user={user}><List /></Adminrouter>} />
            <Route path="/users/:id" element={<Adminrouter user={user}><Single/></Adminrouter>} />
            <Route path="new" element={<Adminrouter user={user}><New title="Add New Collaborator" /></Adminrouter>} />
          </Route>

          <Route path="/categories">
            <Route index element={<Adminrouter user={user}><Category /></Adminrouter>} />
            <Route path="/categories/:id" element={<Adminrouter user={user}><SingleCategory/></Adminrouter>} />
            <Route path="new" element={<Adminrouter user={user}><Categorynew title="Add New Category" /></Adminrouter>} />
          </Route>

          <Route path='/users/update/:id' element={<Adminrouter user={user}><Details /></Adminrouter>} />
          <Route path='/categories/update/:id' element={<Adminrouter user={user}><CategoryDetails /></Adminrouter>} />

          <Route path='/Home' element={<Privaterouter user={user}>  <Feed /></Privaterouter>} />
          <Route path='/Home/search' element={<Privaterouter user={user}>  <Feed /></Privaterouter>} />
          <Route path='/Bookmarks' element={<Privaterouter user={user}>  <Bookmark /></Privaterouter>} />
          <Route path='/Bookmarks/search' element={<Privaterouter user={user}>  <Bookmark/></Privaterouter>} />
          <Route path='/Drafts' element={<Privaterouter user={user}>  <Drafts /></Privaterouter>} />
          <Route path='/Drafts/search' element={<Privaterouter user={user}>  <Drafts/></Privaterouter>} />
          
          <Route path='/category/:id/notes' element={<Privaterouter user={user}>  <CategoryNotes /></Privaterouter>} />
          <Route path='/category/:id/notes/search' element={<Privaterouter user={user}>  <CategoryNotes /></Privaterouter>} />

          <Route path='/category/:id/QA' element={<Privaterouter user={user}>  <CategoryQA /></Privaterouter>} />
          <Route path='/category/:id/QA/search' element={<Privaterouter user={user}>  <CategoryQA /></Privaterouter>} />

          <Route path='/post/:id' element={<Privaterouter user={user}>  <PostDetails /></Privaterouter>} />
          <Route path='/Add-Question' element={<Privaterouter user={user}>  <AddQuestion /></Privaterouter>} />
          <Route path='/Main-Question/:id' element={<Privaterouter user={user}>  <MainQuestion /></Privaterouter>} />
          <Route path='/Chats' element={<Privaterouter user={user}>  <Chats /></Privaterouter>} />
          <Route path='/Profile/:id' element={<Privaterouter user={user}>  <Profile /></Privaterouter>} />

          <Route path='/notfound' element={<NotFound />} />
          <Route path='/noaccess' element={<NoAccess />} />
          <Route path='/forgotpassword' element={<Forgotpassword />} />
          <Route path='/resetpassword/:token' element={<Resetpassword />} />
        </Routes>
      </Router>
      </div>
    </HomeContext.Provider>
  );
}

export default App;