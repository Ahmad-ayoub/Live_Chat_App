import React, {createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const UserLogout = createContext();

export const userLogout = ({children}) => {
    const [userData, setUserData] = useState()
    const [state, setState] = useState(0)

    let navigate = useNavigate();

    const logout = () => {
        navigate("/");
        setUserData(localStorage.clear())
        setUserData(null)
        setState(prevKey => prevKey + 1)
      }


      return (
        <UserContext.Provider value={{ userData, logout, state}}>
          {children}
        </UserContext.Provider>
      );

}