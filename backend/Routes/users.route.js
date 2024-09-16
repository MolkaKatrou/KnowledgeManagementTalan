const express = require('express');
const { AddUser, FindAllUsers, FindSingleUser,VerifyEmail, UpdateUser, DeleteUser,updateProfilePicture, Login, Test, Admin, Resetpassword, Newpassword, SearchUsers, Changepassword, LoginVerify } = require('../controllers/users.controlers');
const router = express.Router();
const passport=require('passport');
const { ROLES, inRole } = require('../security/Rolemidlleware');
const { auth, Verify } = require('../security/auth');


router.post('/users', AddUser);
router.get('/users', auth, FindAllUsers);
router.get('/users/:id', auth, FindSingleUser);
router.patch('/users/:id', auth, UpdateUser)
router.put('/users/update/updatePicture', auth, updateProfilePicture)
router.delete('/users/:id', auth,  DeleteUser)

/* users Login */
router.post('/login',Verify, Login);
router.post('/loginVerify', LoginVerify);
router.post('/forgotpassword', Resetpassword);
router.post('/resetpassword', Newpassword)
router.get('/searchUsers',auth, SearchUsers)
router.post('/changepassword',auth, Changepassword)
router.get('/verify/:token', VerifyEmail)




module.exports = router;