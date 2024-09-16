import { useEffect, useState, createContext, useContext, useRef } from "react";

export const userNameContext = createContext();

export const SetUserData = () => useContext(userNameContext);
console.log(userNameContext, "userNameContext");

export const UserNameProvider = ({ userData, children }) => {
  const [userName, setUserName] = useState();
  const saved_UserName = useRef("");

  useEffect(() => {
    current_userName = localStorage.getItem(
      "current_username",
      userData.username
    );

    if (current_userName) {
      setUserName(current_userName);
      saved_UserName.current = current_userName;
    }
  }, [current_userName]);

  useEffect(() => {
    localStorage.getItem("current_username", userData.username);
    saved_UserName.current = userName;
  }, [current_userName]);

  return (
    <userNameContext.Provider value={{ userName, setUserName }}>
      {children}
    </userNameContext.Provider>
  );
};

export default SetUserData;
