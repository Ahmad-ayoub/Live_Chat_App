import React, { createContext, useState, useContext } from "react";

const FontContext = createContext();

export const useFont = () => useContext(FontContext);

export const FontProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState();

  return (
    <FontContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontContext.Provider>
  );
};

export default FontContext;
