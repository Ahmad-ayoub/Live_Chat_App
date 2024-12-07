import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  faArrowLeft,
  faFont,
  faPalette,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { themeClasses } from "../ThemeChange/ThemeClasses";
import useTheme from "../ThemeChange/UseTheme";
import { ThemeContext } from "../ThemeChange/UseTheme";
import { FontClasses } from "../FontChange/FontClasses";
import FontContext, { useFont } from "../FontChange/FontChange";
import axios from "axios";
import { UserContext } from "../UserContext/UserContext";

const SettingsPage = () => {
  let navigate = useNavigate();

  function goToMain() {
    navigate("/MainPage");
  }

  function goToAuthPage() {
    navigate("/");
  }

  const { userData } = useContext(UserContext);
  const { updateUserData } = useContext(UserContext);
  const [isThemeHovered, setIsThemeHovered] = useState(false);
  const [isFontHovered, setIsFontHovered] = useState(false);
  const { theme } = useContext(ThemeContext);
  const { changeTheme } = useTheme();
  const currentThemeClasses =
    themeClasses[theme] || themeClasses["defaultTheme"];
  const { fontSize } = useContext(FontContext);
  const { setFontSize } = useFont();
  const currentFontClasses =
    FontClasses[fontSize] || FontClasses["fontDefault"];
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState("");

  // useEffect(() => {
  //   const rawData = localStorage.getItem("userData");
  //   console.log("rawData", rawData);
  //   console.log("localStorageKeys", Object.keys(localStorage))
  //   const userData = JSON.parse(rawData);
  //   console.log("userData", userData);
  //   const user_token = userData.user_token;
  //   console.log("user_token", user_token);
  // }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateForm(name, username, email, password);
    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post("/api/edit", {
          name,
          username,
          email,
          password,
        });
        setIsEditing(false);
        updateUserData(response.data);
        setName("");
        setUsername("");
        setEmail("");
        setPassword("");
        console.log("Updated userData:", userData);
      } catch (error) {
        console.log("error: ", error);
        setFormErrors({ apiError: error.response.data.error });
        console.log(formErrors);
        console.log(error.message);
        console.log(error.name);
        console.log(error.stack);
      }
    } else {
      setFormErrors(errors);
      console.log(formErrors);
    }
  };

  axios.interceptors.request.use(function (config) {
    const userDataString = localStorage.getItem("userData");
    console.log("userDataString", userDataString)
    const userData = JSON.parse(userDataString);
    console.log("userData", userData)
    const user_token = userData.user_token
    console.log("user_token", user_token);
    const user_id = userData.user_id
    console.log("user_id", user_id);
    config.headers.Authorization = user_token ? `Bearer ${user_token}` : "";
    return config;
  });

  function validatePassword(password) {
    const errors = {};

    // Check for minimum length
    if (password.length < 10) {
      errors.length = "Password must be at least 10 characters long.";
    }

    // Check for a number
    if (!/\d/.test(password)) {
      errors.number = "Password must include at least one number.";
    }

    // Check for a capital letter
    if (!/[A-Z]/.test(password)) {
      errors.capital = "Password must include at least one uppercase letter.";
    }

    // Check for either '!' or '?'
    if (!/[!?]/.test(password)) {
      errors.special = "Password must include either '!' or '?'.";
    }

    return errors;
  }

  function validateName(name) {
    const errors = {};

    if (name.length < 3) {
      errors.length = "Must be at least 3 characters long.";
    }

    const letterCount = (name.match(/[a-zA-Z]/g) || []).length;
    if (letterCount < 3) {
      errors.letters = "Must contain at least 3 letters.";
    }

    return errors;
  }

  function validateUsername(username) {
    const errors = {};

    if (username.length < 3) {
      errors.length = "Must be at least 3 characters long.";
    }

    const letterCount = (username.match(/[a-zA-Z]/g) || []).length;
    if (letterCount < 3) {
      errors.letters = "Must contain at least 3 letters.";
    }

    return errors;
  }

  function validateEmail(email) {
    const errors = {};
    const validDomains = ["gmail.com", "yahoo.com", "outlook.com"]; // Add more as needed

    if (!email.includes("@") || !email.includes(".")) {
      errors.format = "Email must contain '@' and a dot.";
    } else {
      const domain = email.split("@")[1];
      if (!validDomains.includes(domain)) {
        errors.domain = "Email domain is not valid.";
      }
    }

    return errors;
  }

  function validateForm(name, username, email, password) {
    let errors = {};

    const nameErrors = validateName(name);
    const usernameErrors = validateUsername(username);
    const emailErrors = validateEmail(email);
    const passwordErrors = validatePassword(password);

    // Merge individual error objects into the main errors object
    errors = {
      ...errors,
      ...nameErrors,
      ...usernameErrors,
      ...emailErrors,
      ...passwordErrors,
    };

    return errors;
  }

  return (
    <div className={`settingsPage_layout ${currentFontClasses}`}>
      <main className={`${currentThemeClasses.mainColor}`}>
        <div className="backbutton_usernamebox">
          <FontAwesomeIcon
            icon={faArrowLeft}
            size="2x"
            onClick={goToMain}
            className="backbutton"
          />
          <FontAwesomeIcon icon={faUser} size="2x" />
          {userData && <p className="font_style">{userData.username}</p>}
        </div>
        <div className="button_layout">
          <div
            onMouseEnter={() => setIsThemeHovered(true)}
            onMouseLeave={() => setIsThemeHovered(false)}
            className="button_layout_one"
          >
            <button className="button_shape">
              <FontAwesomeIcon icon={faPalette} size="2x" />
              <p className="btntext_format">Theme</p>
            </button>
          </div>
          <div
            onMouseEnter={() => setIsFontHovered(true)}
            onMouseLeave={() => setIsFontHovered(false)}
            className="button_layout_two"
          >
            <button className="button_shape">
              <FontAwesomeIcon
                icon={faFont}
                size="2x"
                className="fonticon_format"
              />
              <p className="btntext_format">Font</p>
            </button>
          </div>
          <div className="chat_list_box logout_button_box ">
            <button className="logout_button" onClick={goToAuthPage}>
              <p className="logout_text">Log Out</p>
            </button>
          </div>
        </div>
      </main>
      <section className={`${currentThemeClasses.secondaryColor}`}>
        {isThemeHovered && (
          <div
            onMouseEnter={() => setIsThemeHovered(true)}
            onMouseLeave={() => setIsThemeHovered(false)}
            className="themeSelection"
          >
            <button
              className="themeonelayout"
              onClick={() => changeTheme("defaultTheme")}
            >
              Main Theme
            </button>
            <button
              className="themetwolayout"
              onClick={() => changeTheme("secondaryTheme")}
            >
              Theme 2
            </button>
            <button
              className="themethreelayout"
              onClick={() => changeTheme("thirdTheme")}
            >
              Theme 3
            </button>
          </div>
        )}
        {isFontHovered && (
          <div
            onMouseEnter={() => setIsFontHovered(true)}
            onMouseLeave={() => setIsFontHovered(false)}
            className="fontSelection"
          >
            <button
              className="fontonelayout"
              onClick={() => setFontSize("small")}
            >
              Small
            </button>
            <button
              className="fonttwolayout"
              onClick={() => setFontSize("default")}
            >
              Default
            </button>
            <button
              className="fontthreelayout"
              onClick={() => setFontSize("large")}
            >
              Large
            </button>
          </div>
        )}
        {isEditing ? (
          <form onSubmit={handleSubmit} onsubmit={"return false"} className="editingStyle">
            <div>
              <label htmlFor="name" className="nameSpacing">
                Name:
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="textboxStyle"
              />
            </div>
            {/* Username Input */}
            <div>
              <label htmlFor="username" className="nameSpacing">
                Username:
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="textboxStyle"
              />
            </div>
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="nameSpacing">
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="textboxStyle"
              />
            </div>
            {/* Password Input */}
            <div>
              <label htmlFor="password" className="nameSpacing">
                Password:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="textboxStyle"
              />
            </div>
            <button type="submit" className="submit-button">
              Submit
            </button>
            <button
              type="button"
              className="button_cancel"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </form>
        ) : (
          <section className="editingStyle">
            <FontAwesomeIcon icon={faUser} size="2x" />
            {userData && <h2>{userData.name}</h2>}
            {userData && <h2>{userData.email}</h2>}
            {userData && <h2>{userData.username}</h2>}
            <button className="button_edit" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          </section>
        )}
      </section>
    </div>
  );
};
export default SettingsPage;
