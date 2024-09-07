import React, { useState } from "react";
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

  const loginUser = (event) => {
    event.preventDefault();
    axios
      .post("/login", { username, password })
      .then((response) => {
        console.log("response data", response.data);
        setUserData(response.data);
        setMessage("You logged in!");
        console.log(response.data.message);
        const login_token = response.data.login_token;
        console.log("login_token", login_token);
        localStorage.setItem("login_token", login_token);
        const user_token = response.data.user_token;
        localStorage.setItem("user_token", user_token);
        console.log("user_token", user_token);
        navigate("/MainPage");
      })
      .catch((error) => {
        console.log(error);
        setMessage("Failed to log in. Please check your credentials.");
      });
  };

  return (
    <Router>
      <UserProvider>
        <FontProvider>
          <ThemeProvider>
            <Routes>
              <Route
                path="/"
                element={<AuthPage loginUser={loginUser} />}
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
