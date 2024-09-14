import { useEffect, useState, createContext, useContext, useRef } from "react";

export const userNameContext = createContext();

export const SetUserData = () => useContext(userNameContext);
console.log(userNameContext, "userNameContext");

export const UserNameProvider = ({ userData, children }) => {
  const [userName, setUserName] = useState();
  let current_userName = useRef(null);
  current_userName.current = "current_username";

  const KeepUserName = () => {
    current_userName.current.focus();
  };

  useEffect(() => {
    KeepUserName();
    localStorage.setItem("current_username", userData.username);
  }, [current_userName]);

  useEffect(() => {
    current_userName = localStorage.getItem(
      "current_username",
      userData.username
    );

    if (current_userName) {
      setUserName(current_userName);
    }
  }, [current_userName]);

  return (
    <userNameContext.Provider value={{ userName, setUserName }}>
      {children}
    </userNameContext.Provider>
  );
};

export default SetUserData;
