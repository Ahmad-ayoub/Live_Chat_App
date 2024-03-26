import React, { useContext, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  faArrowAltCircleRight,
  faEllipsisV,
  faMagnifyingGlass,
  faUser,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { themeClasses } from "../ThemeChange/ThemeClasses";
import { ThemeContext } from "../ThemeChange/UseTheme";
import { FontClasses } from "../FontChange/FontClasses";
import FontContext from "../FontChange/FontChange";
import io from "socket.io-client";
import axios from "axios";

const MainPage = ({ userData }) => {
  let navigate = useNavigate();

  function goToSettings() {
    navigate("/SettingsPage");
  }

  function goToAuthPage() {
    navigate("/");
  }

  const { theme } = useContext(ThemeContext);
  const currentThemeClasses =
    themeClasses[theme] || themeClasses["defaultTheme"];
  const { fontSize } = useContext(FontContext);
  const currentFontClasses =
    FontClasses[fontSize] || FontClasses["fontDefault"];
  const socket = io("http://localhost:5000");
  const [message, setMessage] = useState([]);
  const [chat, setChat] = useState([]);

  const handleText = async (e) => {
    e.preventDefault();

    if (message) {
      console.log("Message:", message);
      socket.emit("chat message", message);

      try {
        const token = localStorage.getItem("token");

        await axios.post(
          "http://localhost:5000/messages/send",
          { text: message },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await axios.get("http://localhost:5000/messages", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Error sending message to the backend:", error);
      }

      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setChat((prevChat) => [
        ...prevChat,
        { username: userData.username, text: msg },
      ]);
    });

    return () => {
      socket.off("chat message");
    };
  }, [userData.username]);

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
    setTimeout(() => {
      socket.connect();
    }, 5000);
  });

  socket.on("connect", () => {
    console.log("Connected to Socket.io server");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from Socket.io server");
  });

  socket.on("connect_error", (error) => {
    console.error("Socket.io connection error:", error);
  });

  socket.emit("frontend_to_backend", "Hello from the frontend");

  useEffect(() => {
    socket.on("backend_to_frontend", (message) => {
      console.log("Received message from backend:", message);
    });

    return () => {
      socket.off("backend_to_frontend");
    };
  }, []);

  return (
    <div className="profile_and_group_box">
      <div
        className={`group_chat_list ${currentThemeClasses.mainColor} ${currentFontClasses}`}
      >
        <div className="username_box">
          <FontAwesomeIcon
            icon={faUser}
            className="profile_box_image_mainUser"
          />
          {userData && <p className="profile_box_text">{userData.username}</p>}
          <button className="settings_button" onClick={goToSettings}>
            <FontAwesomeIcon icon={faEllipsisV} />
          </button>
        </div>
        <div className="search-container">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            aria-label="Search"
            className="input-box"
          />
        </div>

        <div className="chat_list_box">
          <button className="chat_list_buttons">
            <FontAwesomeIcon icon={faUserGroup} className="chat_list_icons" />
            <p className="profile_box_text">Group #1</p>
          </button>
        </div>
        <div className="chat_list_box">
          <button className="chat_list_buttons">
            <FontAwesomeIcon icon={faUserGroup} className="chat_list_icons" />
            <p className="profile_box_text">Group #2</p>
          </button>
        </div>
        <div className="chat_list_box">
          <button className="chat_list_buttons">
            <FontAwesomeIcon icon={faUserGroup} className="chat_list_icons" />
            <p className="profile_box_text">Group #3</p>
          </button>
        </div>
        <div className="chat_list_box">
          <button className="chat_list_buttons">
            <FontAwesomeIcon icon={faUserGroup} className="chat_list_icons" />
            <p className="profile_box_text">AI Alex</p>
          </button>
        </div>
        <div className="chat_list_box logout_button_box ">
          <button className="logout_button" onClick={goToAuthPage}>
            <p className="logout_text">Log Out</p>
          </button>
        </div>
      </div>
      <div className={`input_chat_box ${currentThemeClasses.secondaryColor}`}>
        <div className="group_box">
          <FontAwesomeIcon icon={faUserGroup} className="profile_box_image" />
          <p className="profile_box_text">Group #1</p>
        </div>
        <div className="chat_box">
          {chat.map((msg, index) => (
            <div key={index}>
              <p>{msg.username}</p>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleText} className="text_box">
          <input
            className="input_message_box"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type here..."
          />
          <button type="submit" className="input_message_button">
            <FontAwesomeIcon icon={faArrowAltCircleRight} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MainPage;
