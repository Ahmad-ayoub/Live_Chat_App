import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || null
  );

  const updateUserData = (newUserData) => {
    localStorage.setItem("userData", JSON.stringify(newUserData));
    setUserData(newUserData);
  };

  const logout = () => {
    localStorage.clear()
  }

  return (
    <UserContext.Provider value={{ userData, updateUserData, logout }}>
      {children}
    </UserContext.Provider>
  );
};
