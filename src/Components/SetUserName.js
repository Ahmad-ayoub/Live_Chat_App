import { useEffect, useState, createContext, useContext, useRef } from "react";

export const userNameContext = createContext();

export const SetUserData = () => useContext(userNameContext);
console.log(userNameContext, "userNameContext");

export const UserNameProvider = ({ userData, children }) => {
  const [userName, setUserName] = useState();
  const current_userName = useRef("");

  useEffect(() => {
    localStorage.setItem("current_username", userData.username);
  });

  useEffect(() => {
    current_userName = localStorage.getItem(
      userData.username,
      "current_username"
    );
    current_userName.current = "current_username";
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
