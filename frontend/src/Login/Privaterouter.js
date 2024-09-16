import React from 'react'
import { Navigate } from 'react-router-dom'

export const Redirect = ({user, children}) => {
if (user.isConnected) {
    return  <Navigate to="/Home"  replace/>
  }
    return children
}



export const Privaterouter = ({user, children}) => {
  if (!user.isConnected) {
      return  <Navigate to="/login"  replace/>
    }
      return children
  }
  
  
  export default Privaterouter
  
