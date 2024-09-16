const UserModel = require("../models/users.model");
const { ValidateUser, ValidateLogin, ValidatePassword, ValidateEmail, ValidateChangePassword } = require('../Validation/users.validation')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto')
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
require('dotenv').config();




const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.SendGrid_key
  }
}))



function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const AddUser = async (req, res) => {
  const { errors, isValid } = ValidateUser(req.body);
  try {
    if (!isValid) {
      res.status(404).json(errors);
    } else {
      await UserModel.findOne({ email: req.body.email })
        .then(async (exist) => {
          if (exist) {
            errors.email = "This user already exists";
            res.status(404).json(errors);
          } else {
            crypto.randomBytes(32, (err, buffer) => {
              if (err) {
                console.log(err)
              }
              const token = buffer.toString("hex")
              req.body.password = 'Talan2022'
              const hash = bcrypt.hashSync(req.body.password, 10); //hashed password
              password = req.body.password
              req.body.password = hash;
              req.body.createdAt = new Date().toISOString()
              req.body.firstname = capitalizeFirstLetter(req.body.firstname)
              req.body.lastname = req.body.lastname.toUpperCase()
              req.body.fullname = req.body.firstname + ' ' + req.body.lastname
              req.body.resetToken = token
              UserModel.create(req.body);
              const url = `http://localhost:3000/user/verify-email/${token}`
              transporter.sendMail({
                to: req.body.email,
                from: 'molka.katrou@ensi-uma.tn',
                subject: "Email Verification",
                html: `<html>
              <head>
                <style>
                  table {
                    border-collapse: separate;
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    width: 100%; }
                    table td {
                      font-family: sans-serif;
                      font-size: 14px;
                      vertical-align: top; 
                  }
            
                  .body {
                    background-color: #f6f6f6;
                    width: 100%; 
                  }
                  .container {
                    display: block;
                    margin: 0 auto !important;
                    /* makes it centered */
                    max-width: 580px;
                    padding: 10px;
                    width: 580px; 
                  }
                  .content {
                    box-sizing: border-box;
                    display: block;
                    margin: 0 auto;
                    max-width: 580px;
                    padding: 10px; 
                  }
                  .main {
                    background: #ffffff;
                    border-radius: 3px;
                    width: 100%; 
                  }
            
                  .wrapper {
                    box-sizing: border-box;
                    padding: 20px; 
                  }
            
                  .content-block {
                    padding-bottom: 4px;
                    padding-top: 4px;
                  }
            
                  .footer {
                    clear: both;
                    margin-top: 13px;
                    text-align: center;
                    width: 100%; 
                  }
                    .footer td,
                    .footer p,
                    .footer span{
                      color: #999999;
                      font-size: 12px;
                      text-align: center; 
                  }
                  .btn {
                    margin-top: 30px;
                    box-sizing: border-box;
                    width: 100%; 
                  }
                    .btn > tbody > tr > td {
                      padding-bottom: 15px; }
                    .btn table {
                      width: auto; 
                  }
                    .btn table td {
                      background-color: #ffffff;
                      border-radius: 5px;
                      text-align: center; 
                  }
                    .btn a {
                      background-color: #ffffff;
                      border: solid 1px #3498db;
                      border-radius: 5px;
                      box-sizing: border-box;
                      color: #3498db;
                      cursor: pointer;
                      display: inline-block;
                      font-size: 14px;
                      font-weight: bold;
                      margin: 0;
                      padding: 12px 25px;
                      text-decoration: none;
                      text-transform: capitalize; 
                  }
                  .btn a:hover {
                    background-color: #2E2A50;
                    border: solid 1px #2E2A50;
                    
                }
            
                  .btn-primary table td {
                    background-color: #3498db; 
                  }
            
                  .btn-primary a {
                    background-color: #3498db;
                    border-color: #3498db;
                    color: #ffffff; 
                  }
            
                </style>
              </head>
              <body>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
                  <tr>
                    <td>&nbsp;</td>
                    <td class="container">
                      <div class="content">        
                        <table role="presentation" class="main" style="border-top: 3px solid #d4dadf;  margin-top:30px; border-bottom: 3px solid #d4dadf;"">
           
                          <tr>
                            <td class="wrapper">
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td>
                                  <p>Hello </strong><span style="text-transform:uppercase">${req.body.firstname}</span><strong></strong>, <p/>
                                  <p>Welcome to to our knowledge management application at TALAN,
                                  Click on the button bellow to verify your account and set your password <br/>                              
                                  </p>
                                  
                                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                                      <tbody>
                                        <tr>
                                          <td align="center" >
                                          <a href=${url} target="_blank">Verify Your Email</a>                                    
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>                                   
                                    <p>  Best regards.</p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>                  
                        <div class="footer">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0">                     
                          <tr>
                          <td align="center" class="content-block powered-by">
                            To know more about us,
                          </td>
                        </tr>
                        <tr>
                        <td align="center" class="content-block powered-by">
                         Visit <a href="https://talan.com/">Talan Group</a> at any time.
                        </td>
                      </tr>
                          </table>
                        </div>
                        <!-- END FOOTER -->
            
                      </div>
                    </td>
                    <td>&nbsp;</td>
                  </tr>
                </table>
              </body>
            </html>`
              })

              res.status(201).json({ message: "User added with success!" });
            })
          }
        });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const VerifyEmail = async (req, res) => {
  try {
    const token = req.params.token
    const user = await UserModel.findOne({ resetToken: token })
    if (user) {
      
      res.status(200).json(user)
    }
    else {
      res.status(404).send({ message: "The email is not verified" })
    }

  } catch (error) {
    console.log(error.message);
  }
};

const FindAllUsers = async (req, res) => {
  try {
    const data = await UserModel.find();
    res.status(201).json(data);
  } catch (error) {
    console.log(error.message);
  }
};

const FindSingleUser = async (req, res) => {
  try {
    const data = await UserModel.findOne({ _id: req.params.id });
    res.status(201).json(data);
  } catch (error) {
    console.log(error.message);
  }
};

const UpdateUser = async (req, res) => {
  const { errors, isValid } = ValidateUser(req.body);
  try {
    if (!isValid) {
      res.status(404).json(errors);
    } else {
      req.body.firstname = capitalizeFirstLetter(req.body.firstname)
      req.body.lastname = req.body.lastname.toUpperCase()
      req.body.fullname = req.body.firstname + ' ' + req.body.lastname
      const data = await UserModel.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );
      transporter.sendMail({
        to: req.body.email,
        from: 'molka.katrou@ensi-uma.tn',
        subject: "Account Informations Update",
        html: `<html>
      <head>
        <style>
          table {
            border-collapse: separate;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            width: 100%; }
            table td {
              font-family: sans-serif;
              font-size: 14px;
              vertical-align: top; 
          }
    
          .body {
            background-color: #f6f6f6;
            width: 100%; 
          }
          .container {
            display: block;
            margin: 0 auto !important;
            /* makes it centered */
            max-width: 580px;
            padding: 10px;
            width: 580px; 
          }
          .content {
            box-sizing: border-box;
            display: block;
            margin: 0 auto;
            max-width: 580px;
            padding: 10px; 
          }
          .main {
            background: #ffffff;
            border-radius: 3px;
            width: 100%; 
          }
    
          .wrapper {
            box-sizing: border-box;
            padding: 20px; 
          }
    
          .content-block {
            padding-bottom: 4px;
            padding-top: 4px;
          }
    
          .footer {
            clear: both;
            margin-top: 13px;
            text-align: center;
            width: 100%; 
          }
            .footer td,
            .footer p,
            .footer span{
              color: #999999;
              font-size: 12px;
              text-align: center; 
          }
          .btn {
            margin-top: 30px;
            box-sizing: border-box;
            width: 100%; 
          }
            .btn > tbody > tr > td {
              padding-bottom: 15px; }
            .btn table {
              width: auto; 
          }
            .btn table td {
              background-color: #ffffff;
              border-radius: 5px;
              text-align: center; 
          }
            .btn a {
              background-color: #ffffff;
              border: solid 1px #3498db;
              border-radius: 5px;
              box-sizing: border-box;
              color: #3498db;
              cursor: pointer;
              display: inline-block;
              font-size: 14px;
              font-weight: bold;
              margin: 0;
              padding: 12px 25px;
              text-decoration: none;
              text-transform: capitalize; 
          }
          .btn a:hover {
            background-color: #2E2A50;
            border: solid 1px #2E2A50;
            
        }
    
          .btn-primary table td {
            background-color: #3498db; 
          }
    
          .btn-primary a {
            background-color: #3498db;
            border-color: #3498db;
            color: #ffffff; 
          }
    
        </style>
      </head>
      <body>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
          <tr>
            <td>&nbsp;</td>
            <td class="container">
              <div class="content">        
                <table role="presentation" class="main" style="border-top: 3px solid #d4dadf;  margin-top:30px; border-bottom: 3px solid #d4dadf;"">
   
                  <tr>
                    <td class="wrapper">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                          <p>Hello </strong><span style="text-transform:uppercase">${req.body.firstname}</span><strong></strong>, <p/>
                          <p>We have updated your account's Personal informations to fit with your current status at Talan Consulting</p>
                                             
                            <p>  Best regards.</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>                  
                <div class="footer">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">                     
                  <tr>
                  <td align="center" class="content-block powered-by">
                    To know more about us,
                  </td>
                </tr>
                <tr>
                <td align="center" class="content-block powered-by">
                 Visit <a href="https://talan.com/">Talan Group</a> at any time.
                </td>
              </tr>
                  </table>
                </div>
                <!-- END FOOTER -->
    
              </div>
            </td>
            <td>&nbsp;</td>
          </tr>
        </table>
      </body>
    </html>`
      })
      res.status(201).json(data);
    }
  } catch (error) {
    console.log(error.message);
  }
};

const DeleteUser = async (req, res) => {
  try {
    const data = await UserModel.findOne({ _id: req.params.id });
    await UserModel.findOneAndDelete({ _id: req.params.id });
    transporter.sendMail({
      to: data.email,
      from: 'molka.katrou@ensi-uma.tn',
      subject: "Account Deletion",
      html: `<html>
    <head>
      <style>
        table {
          border-collapse: separate;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
          width: 100%; }
          table td {
            font-family: sans-serif;
            font-size: 14px;
            vertical-align: top; 
        }
  
        .body {
          background-color: #f6f6f6;
          width: 100%; 
        }
        .container {
          display: block;
          margin: 0 auto !important;
          /* makes it centered */
          max-width: 580px;
          padding: 10px;
          width: 580px; 
        }
        .content {
          box-sizing: border-box;
          display: block;
          margin: 0 auto;
          max-width: 580px;
          padding: 10px; 
        }
        .main {
          background: #ffffff;
          border-radius: 3px;
          width: 100%; 
        }
  
        .wrapper {
          box-sizing: border-box;
          padding: 20px; 
        }
  
        .content-block {
          padding-bottom: 4px;
          padding-top: 4px;
        }
  
        .footer {
          clear: both;
          margin-top: 13px;
          text-align: center;
          width: 100%; 
        }
          .footer td,
          .footer p,
          .footer span{
            color: #999999;
            font-size: 12px;
            text-align: center; 
        }
        .btn {
          margin-top: 30px;
          box-sizing: border-box;
          width: 100%; 
        }
          .btn > tbody > tr > td {
            padding-bottom: 15px; }
          .btn table {
            width: auto; 
        }
          .btn table td {
            background-color: #ffffff;
            border-radius: 5px;
            text-align: center; 
        }
          .btn a {
            background-color: #ffffff;
            border: solid 1px #3498db;
            border-radius: 5px;
            box-sizing: border-box;
            color: #3498db;
            cursor: pointer;
            display: inline-block;
            font-size: 14px;
            font-weight: bold;
            margin: 0;
            padding: 12px 25px;
            text-decoration: none;
            text-transform: capitalize; 
        }
        .btn a:hover {
          background-color: #2E2A50;
          border: solid 1px #2E2A50;
          
      }
  
        .btn-primary table td {
          background-color: #3498db; 
        }
  
        .btn-primary a {
          background-color: #3498db;
          border-color: #3498db;
          color: #ffffff; 
        }
  
      </style>
    </head>
    <body>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
        <tr>
          <td>&nbsp;</td>
          <td class="container">
            <div class="content">        
              <table role="presentation" class="main" style="border-top: 3px solid #d4dadf;  margin-top:30px; border-bottom: 3px solid #d4dadf;"">
 
                <tr>
                  <td class="wrapper">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                        <p>Hello </strong><span style="text-transform:uppercase">${data.firstname}</span><strong></strong>, <p/>
                        <p>We have unfortuanately deleted your account associated with this Email from our database, you will no longer
                        be able to access our knowledge management plateform at TALAN CONSULTING<br/>                              
                        </p>

                        <p>We are sorry to see you go.<br/>                              
                        </p>
                                                        
                          <p>Best regards.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>                  
              <div class="footer">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">                     
                <tr>
                <td align="center" class="content-block powered-by">
                  To know more about us,
                </td>
              </tr>
              <tr>
              <td align="center" class="content-block powered-by">
               Visit <a href="https://talan.com/">Talan Group</a> at any time.
              </td>
            </tr>
                </table>
              </div>
              <!-- END FOOTER -->
  
            </div>
          </td>
          <td>&nbsp;</td>
        </tr>
      </table>
    </body>
  </html>`
    })
    res.status(201).json({ message: "User deleted with success!" });
  } catch (error) {
    console.log(error.message);
  }
};

const Login = async (req, res) => {
  const { errors, isValid } = ValidateLogin(req.body)
  try {
    UserModel.findOne({ email: req.body.email })
      .then(user => {
        bcrypt.compare(req.body.password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              errors.password = "The password is incorrect"
              res.status(404).json(errors)
            } else {
              var token = jwt.sign({
                id: user._id,
                username: user.username,
                email: user.email,
                lastname: user.lastname,
                firstname: user.firstname,
                fullname: user.fullname,
                phone: user.phone,
                role: user.role,
                occupation: user.occupation,
                pic: user.pic

              },
                process.env.PRIVATE_KEY, { expiresIn: '10d' });
              res.status(200).json({
                message: "success",
                token: "Bearer " + token,
                user: {
                  id: user._id,
                  username: user.username,
                  email: user.email,
                  lastname: user.lastname,
                  firstname: user.firstname,
                  fullname: user.fullname,
                  phone: user.phone,
                  role: user.role,
                  occupation: user.occupation,
                  pic: user.pic

                },
              })

            }
          })

      })

  } catch (error) {
    res.status(404).json(error.message);
  }
}

const LoginVerify = async (req, res) => {
  const newPassword = req.body.password
  const { errors, isValid } = ValidatePassword(req.body)
  try {
    if (!isValid) {
      res.status(404).json(errors)
    } else {
      UserModel.findOne({ email: req.body.email })
        .then(user => {
          user.resetToken = undefined
          user.isVerified = true
          bcrypt.hash(newPassword, 12)
            .then(hashedpassword => {
              user.password = hashedpassword
              user.save()
            })
          var token = jwt.sign({
            id: user._id,
            username: user.username,
            email: user.email,
            lastname: user.lastname,
            firstname: user.firstname,
            fullname: user.fullname,
            phone: user.phone,
            role: user.role,
            occupation: user.occupation,
            pic: user.pic

          },
            process.env.PRIVATE_KEY, { expiresIn: '10d' });
          res.status(200).json({
            message: "success",
            token: "Bearer " + token,
            user: {
              id: user._id,
              username: user.username,
              email: user.email,
              lastname: user.lastname,
              firstname: user.firstname,
              fullname: user.fullname,
              phone: user.phone,
              role: user.role,
              occupation: user.occupation,
              pic: user.pic
            },
          })

        })
    }
  } catch (error) {
    res.status(404).json(error.message);
  }
}

const Resetpassword = async (req, res) => {
  const { errors, isValid, success } = ValidateEmail(req.body)
  try {
    if (!isValid) {
      res.status(404).json(errors)
    } else {
      crypto.randomBytes(32, (err, buffer) => {
        if (err) {
          console.log(err)
        }
        const token = buffer.toString("hex")
        UserModel.findOne({ email: req.body.email })
          .then(user => {
            if (!user) {
              errors.email = "The user does not exist!"
              res.status(404).json(errors)
            } else {
              success.email = "ok"
              res.status(201).json(success)
              user.resetToken = token
              user.expireToken = Date.now() + 36000
              user.save().then((result) => {
                transporter.sendMail({
                  to: user.email,
                  from: 'molka.katrou@ensi-uma.tn',
                  subject: "Password Reset",
                  html: `<html>
                  <head>
                    <style>
                      table {
                        border-collapse: separate;
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        width: 100%; }
                        table td {
                          font-family: sans-serif;
                          font-size: 14px;
                          vertical-align: top; 
                      }
                
                      .body {
                        background-color: #f6f6f6;
                        width: 100%; 
                      }
                      .container {
                        display: block;
                        margin: 0 auto !important;
                        /* makes it centered */
                        max-width: 580px;
                        padding: 10px;
                        width: 580px; 
                      }
                      .content {
                        box-sizing: border-box;
                        display: block;
                        margin: 0 auto;
                        max-width: 580px;
                        padding: 10px; 
                      }
                      .main {
                        background: #ffffff;
                        border-radius: 3px;
                        width: 100%; 
                      }
                
                      .wrapper {
                        box-sizing: border-box;
                        padding: 20px; 
                      }
                
                      .content-block {
                        padding-bottom: 4px;
                        padding-top: 4px;
                      }
                
                      .footer {
                        clear: both;
                        margin-top: 20px;
                        text-align: center;
                        width: 100%; 
                      }
                        .footer td,
                        .footer p,
                        .footer span{
                          color: #999999;
                          font-size: 12px;
                          text-align: center; 
                      }
                      .btn {
                        margin-top: 55px;
                        box-sizing: border-box;
                        margin-bottom:25px;
                        width: 100%; 
                      }
                        .btn > tbody > tr > td {
                          padding-bottom: 15px; }
                        .btn table {
                          width: auto; 
                      }
                        .btn table td {
                          background-color: #ffffff;
                          border-radius: 30px;
                        
                      }
                        .btn a {
                          background-color: #ffffff;
                          border: solid 1px #3498db;
                          border-radius: 30px;
                          box-sizing: border-box;
                          color: #3498db;
                          cursor: pointer;
                          font-size: 12px;
                          font-weight: bold;
                          margin: 0;
                          padding: 10px 15px;
                          text-decoration: none;
                          text-transform: capitalize; 
                          
                      }
                      .btn a:hover {
                        background-color: #2E2A50;
                        border: solid 1px #2E2A50;
                        
                    }
                
                      .btn-primary table td {
                        background-color: #3498db; 
                      }
                
                      .btn-primary a {
                        background-color: #3498db;
                        border-color: #3498db;
                        color: #ffffff; 
                      }
                
                    </style>
                  </head>
                  <body>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
                      <tr>
                        <td>&nbsp;</td>
                        <td class="container">
                          <div class="content">        
                            <table role="presentation" class="main" style="border-top: 3px solid #d4dadf;  margin-top:30px; border-bottom: 3px solid #d4dadf;">
                            <tr>
                            <td align="left" bgcolor="#ffffff" style="padding: 37px 25px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; ">
                              <h3 style="margin: 0; font-size: 21px; font-weight: 700; line-height: 48px; margin-top:13px">Reset Your Password</h3>
                            </td>
                          </tr>
                              <tr>
                                <td class="wrapper">
                                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                    <tr>
                                      <td>
                                     
                                      <p style="margin: 0;">Tap the button below to reset your account password for the knowledge management platform at Talan Consulting. If you didn't reset your password within the next hour, the request will expire</p>
                                      
                                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                                          <tbody>
                                            <tr>
                                              <td align="center" >
                                              <a href="http://localhost:3000/resetpassword/${token}" target="_blank" style=" padding: 18px 28px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 13px; color: #ffffff; text-decoration: none; border-radius: 30px;">Reset Your Password</a>                                  
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>                                   
                                       
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>                  
                            <div class="footer">
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0">                     
                                <tr>
                                  <td align="center" class="content-block powered-by">
                                    To know more about us,
                                  </td>
                                </tr>
                                <tr>
                                <td align="center" class="content-block powered-by">
                                 Visit <a href="https://talan.com/">Talan Group</a> at any time.
                                </td>
                              </tr>
                              </table>
                            </div>
                            <!-- END FOOTER -->
                
                          </div>
                        </td>
                        <td>&nbsp;</td>
                      </tr>
                    </table>
                  </body>
                </html>`
          

                })
              })
            }
          })
      }
      )
    }
  } catch (error) {
    res.status(404).json(error.message);
  }
}

const Newpassword = async (req, res) => {
  const { errors, isValid } = ValidatePassword(req.body)
  const newPassword = req.body.password
  const sentToken = req.body.token
  try {
    if (!isValid) {
      res.status(404).json(errors)
    } 
    else {
      UserModel.findOne({ resetToken: sentToken })
        .then(user => {
          if (!user) {
            errors.expired = "Your session has expired, send another request to reset your password"
            return res.status(422).json(errors)
          }
          else {
          bcrypt.hash(newPassword, 12).then(hashedpassword => {
            user.password = hashedpassword
            user.resetToken = undefined
            user.expireToken = undefined
            user.save().then((saveduser) => {
              res.json({ message: "password updated success" })
            })
          })
        }
        })
    }
  }
  catch (error) {
    res.status(404).json(error.message);
  }
}

const Changepassword = async (req, res) => {
  const { errors, isValid } = ValidateChangePassword(req.body)
  try {
    if (!isValid) {
      res.status(404).json(errors)
    } else {
      if (bcrypt.compareSync(req.body.old_password, req.user.password)) {
        let hashedpassword = bcrypt.hashSync(req.body.new_password, 10)
        await UserModel.updateOne({ _id: req.userId }, { password: hashedpassword })
        let user = await UserModel.findOne({ _id: req.userId })
        var token = jwt.sign({
          id: user._id,
          username: user.username,
          email: user.email,
          fullname: user.fullname,
        },
          process.env.PRIVATE_KEY, { expiresIn: '10d' });

        res.status(200).json({
          message: "success",
          token: "Bearer " + token,
          user: user
        })


      } else {
        errors.old_password = "Tha password is incorrect"
        return res.status(404).json(errors)
      }
    }
  }
  catch (error) {
    console.log(error.message)
  }

}

const SearchUsers = async (req, res) => {
  try {
    const { keyword } = req.query
    const email = new RegExp(keyword, "i");
    const firstname = new RegExp(keyword, "i");
    const lastname = new RegExp(keyword, "i");

    const users = await UserModel.find({ $or: [{ email }, { firstname }, { lastname }] }
    ).find({ _id: { $ne: req.userId } });
    res.status(201).json(users);
  }
  catch (error) {
    res.status(404).json(error.message);
  }
};

const updateProfilePicture = async (req, res) => {
  UserModel.findByIdAndUpdate(req.userId, { $set: { pic: req.body.pic } }, { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "pic canot post" })
      }
      res.json(result)
    })
};



module.exports = {
  Login,
  VerifyEmail,
  AddUser,
  FindAllUsers,
  FindSingleUser,
  UpdateUser,
  DeleteUser,
  Resetpassword,
  Newpassword,
  SearchUsers,
  updateProfilePicture,
  Changepassword,
  LoginVerify
};
