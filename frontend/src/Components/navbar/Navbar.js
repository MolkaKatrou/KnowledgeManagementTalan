import "./navbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { DarkModeContext } from "../../Context/darkModeContext";
import { useContext, useEffect, useState } from "react";
import { Avatar, ChakraProvider } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { HomeContext } from "../../Context/HomeContext";
import LightModeIcon from '@mui/icons-material/LightMode';


const Navbar = () => {
  const {darkMode, dispatchMode } = useContext(DarkModeContext);
  const auth = useSelector(state => state.auth);
  const { currentLanguageCode} = useContext(HomeContext)
  const [language, setLanguage ]=useState('')

  useEffect(() => {
    currentLanguageCode ==='fr' ? setLanguage('Français') : setLanguage('English')
  }, [])
  

  return (
    <div className="navbar_admin">
      <div className="wrapper_admin">
        <div >   
        </div>
        <div className="items">
          <div className=" mx-2">
            <LanguageOutlinedIcon />
            {language}
          </div>
          <div className=" mx-4 " style={{cursor:'pointer'}} 
              onClick={() => dispatchMode({ type: "TOGGLE" })}>
          {darkMode ? <DarkModeOutlinedIcon/> : <LightModeIcon/> }
        
      
          </div>
      
     
          <div className="item mx-4">
          <ChakraProvider>
            <Avatar name={auth.user.fullname} src={auth.user.pic} size='sm'></Avatar>
          </ChakraProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
