import React, { createContext, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [message, setMessage] = useState();
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || null
  );

  const updateUserData = (newUserData) => {
    localStorage.setItem("userData", JSON.stringify(newUserData));
    setUserData(newUserData);
  };

  const loginUser = async ({ username, password }) => {
    try {
      const response = await axios.post("/login", { username, password });
      updateUserData(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      setMessage("Failed to log in. Please check your credentials.");
      console.log(message);
    }
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData, loginUser }}>
      {children}
    </UserContext.Provider>
  );
};
