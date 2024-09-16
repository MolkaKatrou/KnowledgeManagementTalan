import { createContext, useEffect, useReducer } from "react";
import DarkModeReducer from "./darkModeReducer";

const INITIAL_STATE = {
  darkMode: false
};

const initializer = (initialValue = INITIAL_STATE) => {
   return {darkMode : localStorage.getItem("dark")} || initialValue;
}

export const DarkModeContext = createContext();
export const DarkModeContextProvider = ({ children }) => {
  const [state, dispatchMode] = useReducer(DarkModeReducer, initializer );

  useEffect(() => {
      localStorage.setItem('dark', state.darkMode);
    },[state.darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode: state.darkMode, dispatchMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
