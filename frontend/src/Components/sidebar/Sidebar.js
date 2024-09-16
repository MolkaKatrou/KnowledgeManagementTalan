import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { NavLink } from "react-router-dom";
import { DarkModeContext } from "../../Context/darkModeContext";
import { useContext } from "react";
import logo from '../../images/logo.png'
import logoDark from '../../images/dark-logo2.png'
import { useDispatch, useSelector } from "react-redux";
import { Logout } from "../../Redux/Actions/authActions";
import { HomeContext } from "../../Context/HomeContext";

const Sidebar = () => {
  const {darkMode, dispatchMode} = useContext(DarkModeContext);
  const {t}= useContext(HomeContext)
  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)

  const LogoutHandler = () => {
    dispatch(Logout())
  }
  return (
    <div className="sidebar">
      <div className="top">
        <NavLink to="/" style={{ textDecoration: "none" }}>
          <span className="mx-2">
            {darkMode ? 
            <img className='mb-2' style={{width:'86%', marginLeft:'-30px'}} src={logoDark} alt='logo' />:
            <img className='mb-2 mx-2 mt-4' style={{width:'45%'}} src={logo} alt='logo' />
            }
          </span>
        </NavLink>
      </div>
      <hr />
      <div className="center">
        <ul style={{marginTop:'20px'}}>
        
          <NavLink to="/users" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon"/>
              <span>{t("Users")}</span>
            </li>
          </NavLink>
          <NavLink to="/categories" style={{ textDecoration: "none" }}>
            <li className="icon">
              <DashboardIcon className="icon"/>
              <span>{t("Categories")}</span>
            </li>
          </NavLink>
       
       
          <p className="title_sidebar">USER</p>
          
          <NavLink to={`/users/${auth.user.id}`} style={{ textDecoration: "none" }}>
          <li className="icon">
            <AccountCircleOutlinedIcon className="icon" />
            <span>Profile</span>
          </li>
          </NavLink>
          <li className="icon" onClick={LogoutHandler}>
            <ExitToAppIcon className="icon" />
            <span>{t("Logout")}</span>
          </li>
        </ul>
      </div>
      <div className="bottom">
        <div
          className="colorOption"
          onClick={() => dispatchMode({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          onClick={() => dispatchMode({ type: "DARK" })}
        ></div>
      </div>
    </div>
  );
};

export default Sidebar;
