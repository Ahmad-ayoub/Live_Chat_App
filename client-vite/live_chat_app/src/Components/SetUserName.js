import { useState, createContext, useMemo } from "react";

const userNameContext = createContext();

const UserNameProvider = ({ children }) => {
  const [userName, setUserName] = useState("");

  const memoUserName = useMemo(() => ({ userName, setUserName }), [userName]);

  return (
    <userNameContext.Provider value={{ memoUserName }}>
      {children}
    </userNameContext.Provider>
  );
};

export { userNameContext, UserNameProvider };
