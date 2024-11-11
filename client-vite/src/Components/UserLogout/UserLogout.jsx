import React, { createContext, useContext, useState } from "react";

export const UserLogout = createContext();

export const userLogout = ({children}) => {
  const [userData, setUserData] = useState()
  const [state, setState] = useState(0)
  

  const logout = (navigate) => {
    navigate("/")
    setUserData(localStorage.clear())
    setUserData(null)
    setState(prevKey => prevKey + 1)
  }


 return (
   <userLogout.Provider value={{ userData, logout, state }}>
     {children}
   </userLogout.Provider>
   );

}