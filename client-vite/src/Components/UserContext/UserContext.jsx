import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [state, setState] = useState(0)
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || null
  );

  const updateUserData = (newUserData) => {
    localStorage.setItem("userData", JSON.stringify(newUserData));
    setUserData(newUserData);
  };

  const logout = () => {
    navigate("/");
    setUserData(localStorage.clear())
    setUserData(null)
    setState(prevKey => prevKey + 1)
  }

  return (
    <UserContext.Provider value={{ userData, updateUserData, logout, state}}>
      {children}
    </UserContext.Provider>
  );
};
