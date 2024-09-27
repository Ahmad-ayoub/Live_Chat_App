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

  const loginUser = ({ username, password }) => {
    return axios
      .post("/login", { username, password })
      .then((response) => {
        updateUserData(response.data);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        setMessage("Failed to log in. Please check your credentials.");
      });
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData, loginUser }}>
      {children}
    </UserContext.Provider>
  );
};
