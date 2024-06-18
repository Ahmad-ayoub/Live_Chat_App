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
  const roomNames = {
    Group1: "Just Chatting",
    Group2: "Video Games",
    Group3: "Literature",
  };

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
  const [selectedRoom, setSelectedRoom] = useState("Group1");
  const [selectedRoomName, setSelectedRoomName] = useState("Just Chatting");

  useEffect(() => {
    const storedRoom = localStorage.getItem("group_room_number");
    const storedRoomName = localStorage.getItem("group_room_name");

    if (storedRoom && storedRoomName) {
      setSelectedRoom(storedRoom);
      setSelectedRoomName(storedRoomName);
      console.log("selectedRoom useEffect", selectedRoom);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedRoom", selectedRoom);
  }, [selectedRoom]);

  const handleRoomClick = (currentRoom) => {
    setSelectedRoom(currentRoom);
    setSelectedRoomName(roomNames[currentRoom]);
    localStorage.setItem("group_room_number", currentRoom);
    localStorage.setItem("group_room_name", roomNames[currentRoom]);
    console.log("group_room_number click", currentRoom);
  };

  axios.interceptors.request.use(function (config) {
    const userToken = localStorage.getItem("user_token");
    const selectedRoom = localStorage.getItem("group_room_number");

    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }

    if (selectedRoom) {
      config.headers.selectedRoom = selectedRoom;
    }

    console.log("userToken axios", userToken);
    console.log("selectedRoom axios", selectedRoom);

    return config;
  });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("http://localhost:5000/messages/all", {
          params: {
            group_room_number: selectedRoom,
          },
        });
        setChat(response.data);
        console.log("group room number: ", selectedRoom);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedRoom]);

  const handleText = async (e) => {
    e.preventDefault();

    if (message) {
      console.log("Message:", message);
      socket.emit("chat message", message);

      try {
        const userToken = localStorage.getItem("user_token");
        await axios.post(
          "http://localhost:5000/messages/send",
          {
            text: message,
            user_token: userToken,
            group_room_number: selectedRoom,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const response = await axios.get("http://localhost:5000/messages", {
          params: {
            user_token: userToken,
            group_room_number: selectedRoom,
          },
        });
        const newMessage = response.data;
        console.log("Response", response);
        setChat((prevChat) => [...prevChat, newMessage]);

        console.log("newMessage:", newMessage);
      } catch (error) {
        console.error("Error sending message to the backend:", error);
      }

      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("chat message", (newMessage) => {
      setChat((prevChat) => [...prevChat, newMessage]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

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
          <button
            className="chat_list_buttons"
            onClick={() => handleRoomClick("Group1")}
          >
            <FontAwesomeIcon icon={faUserGroup} className="chat_list_icons" />
            <p className="profile_box_text">Just Chatting</p>
          </button>
        </div>
        <div className="chat_list_box">
          <button
            className="chat_list_buttons"
            onClick={() => handleRoomClick("Group2")}
          >
            <FontAwesomeIcon icon={faUserGroup} className="chat_list_icons" />
            <p className="profile_box_text">Video Games</p>
          </button>
        </div>
        <div className="chat_list_box">
          <button
            className="chat_list_buttons"
            onClick={() => handleRoomClick("Group3")}
          >
            <FontAwesomeIcon icon={faUserGroup} className="chat_list_icons" />
            <p className="profile_box_text">Literature</p>
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
          <p className="profile_box_text">{selectedRoomName}</p>
        </div>
        <div className="chat-wrapper">
          <div className="chat-container">
            {selectedRoom === "Group1" && (
              <>
                {chat.map((message, index) => (
                  <div
                    className={`message-container ${
                      message.is_current_user ? "" : "other-user"
                    }`}
                    key={index}
                  >
                    <div
                      className={`message-box ${
                        message.is_current_user ? "" : "other-user"
                      }`}
                    >
                      <p
                        className={`username ${
                          message.is_current_user ? "" : "other-user"
                        }`}
                      >
                        {message.username}
                      </p>
                      <p
                        className={`text ${
                          message.is_current_user ? "" : "other-user"
                        }`}
                      >
                        {message.text}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
            {selectedRoom === "Group2" && (
              <>
                {chat.map((message, index) => (
                  <div
                    className={`message-container ${
                      message.is_current_user ? "" : "other-user"
                    }`}
                    key={index}
                  >
                    <div
                      className={`message-box ${
                        message.is_current_user ? "" : "other-user"
                      }`}
                    >
                      <p
                        className={`username ${
                          message.is_current_user ? "" : "other-user"
                        }`}
                      >
                        {message.username}
                      </p>
                      <p
                        className={`text ${
                          message.is_current_user ? "" : "other-user"
                        }`}
                      >
                        {message.text}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
            {selectedRoom === "Group3" && (
              <>
                {chat.map((message, index) => (
                  <div
                    className={`message-container ${
                      message.is_current_user ? "" : "other-user"
                    }`}
                    key={index}
                  >
                    <div
                      className={`message-box ${
                        message.is_current_user ? "" : "other-user"
                      }`}
                    >
                      <p
                        className={`username ${
                          message.is_current_user ? "" : "other-user"
                        }`}
                      >
                        {message.username}
                      </p>
                      <p
                        className={`text ${
                          message.is_current_user ? "" : "other-user"
                        }`}
                      >
                        {message.text}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        <form
          onSubmit={handleText}
          enctype="application/json"
          className="text_box"
        >
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
