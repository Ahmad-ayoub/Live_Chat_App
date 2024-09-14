import { useEffect, useState, createContext, useContext } from "react";

export const userNameContext = createContext();

export const SetUserData = () => useContext(userNameContext);

export const UserNameProvider = ({ userData, children }) => {
  const [userName, setUserName] = useState();

  useEffect(() => {
    localStorage.setItem(userData.username, "current_userName");
  });

  useEffect(() => {
    current_userName = localStorage.getItem(
      userData.username,
      "current_userName"
    );
    if (current_userName) {
      setUserName(current_userName);
    }
  });

  return (
    <userNameContext.Provider value={{ userName, setUserName }}>
      {children}
    </userNameContext.Provider>
  );
};

export default SetUserData;
