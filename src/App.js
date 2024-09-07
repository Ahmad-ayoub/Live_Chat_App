import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Components/AuthPage/AuthPage.css";
import "./Components/MainPage/MainPage.css";
import "./Components/SettingsPage/SettingsPage.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./Components/MainPage/MainPage";
import AuthPage from "./Components/AuthPage/AuthPage";
import SettingsPage from "./Components/SettingsPage/settingsPage";
import { ThemeProvider } from "./Components/ThemeChange/UseTheme";
import { FontProvider } from "./Components/FontChange/FontChange";
import { UserProvider } from "./Components/UserContext/UserContext";

function App() {
  const [userData, setUserData] = useState("");

  useEffect(() => {
    if (userData != "") setUserData(userData);
  }, [userData]);

  return (
    <Router>
      <UserProvider>
        <FontProvider>
          <ThemeProvider>
            <Routes>
              <Route
                path="/"
                element={<AuthPage setUserData={setUserData} />}
                index
              />
              <Route
                path="/MainPage"
                element={<MainPage userData={userData} />}
              />
              <Route
                path="/SettingsPage"
                element={
                  <SettingsPage setUserData={setUserData} userData={userData} />
                }
              />
            </Routes>
          </ThemeProvider>
        </FontProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
