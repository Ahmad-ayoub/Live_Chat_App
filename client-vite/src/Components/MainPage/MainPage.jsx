import React, { useContext, useState, useEffect, useRef } from "react";
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
import { UserContext } from "../UserContext/UserContext";


const MainPage = () => {
  const roomNames = {
    Group1: "Just Chatting",
    Group2: "Video Games",
    Group3: "Literature",
  };

  let navigate = useNavigate();

  function goToSettings() {
    navigate("/SettingsPage");
  }

  const { userData, logOut } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const currentThemeClasses =
    themeClasses[theme] || themeClasses["defaultTheme"];
  const mountedRef = useRef(false);
  const searchButton = document.getElementById('search-button');
  const { fontSize } = useContext(FontContext);
  const currentFontClasses =
    FontClasses[fontSize] || FontClasses["fontDefault"];
  const socket = io("");
  const [message, setMessage] = useState([]);
  const [chat, setChat] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("Group1");
  const [selectedRoomName, setSelectedRoomName] = useState("Just Chatting");
  const [searchTerm, setSearchTerm] = useState([]);
  console.log("searchTerm: ", searchTerm);
  const [searchResults, setSearchResults] = useState([]);
  console.log("searchResults: ", searchResults);
  console.log("whole_new_chat", chat);
  console.log("whole_new_chat", chat.data);
  console.log("its in dev mode", import.meta.env);

  function userLogout() {
    navigate("/")
    const logoutCreds = window.location.reload();
    logOut(logoutCreds)
  }

  useEffect(() => {
    const storedRoom = localStorage.getItem("group_room_number");
    const storedRoomName = localStorage.getItem("group_room_name");

    if (storedRoom && storedRoomName) {
      setSelectedRoom(storedRoom);
      setSelectedRoomName(storedRoomName);
      console.log("selectedRoom useEffect", selectedRoom);
    }
  }, [selectedRoom]);

  useEffect(() => {
    localStorage.setItem("selectedRoom", selectedRoom);
  }, [selectedRoom]);

  useEffect(() => {
    localStorage.setItem("selectedRoomName", selectedRoomName);
  }, [selectedRoomName]);

  useEffect(() => {
    mountedRef.current = true;
    console.log("Component mounted", { mountedRef: mountedRef.current });
  
    return () => {
      mountedRef.current = false;
      console.log("Component unmounted", { mountedRef: mountedRef.current });
    };
  }, []);

  
  const handleRoomClick = (currentRoom) => {
    setSelectedRoom(currentRoom);
    setSelectedRoomName(roomNames[currentRoom]);
    localStorage.setItem("group_room_number", currentRoom);
    localStorage.setItem("group_room_name", roomNames[currentRoom]);
    console.log("group_room_number click", currentRoom);
  };

  axios.interceptors.request.use(function (config) {
    const userToken = userData.user_token;
    const selectedRoom = localStorage.getItem("group_room_number");

    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }

    if (selectedRoom) {
      config.headers.group_room_number = selectedRoom;
    }

    console.log("userToken axios", userToken);
    console.log("selectedRoom axios", selectedRoom);

    return config;
  });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const userToken = userData.user_token;
        const group_room_number = localStorage.getItem("group_room_number");
        const response = await axios.get(`/api/messages/all`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          params: {
            group_room_number,
          },
        });
        setChat(response.data);
        console.log("group room number: msg/all ", selectedRoom);
        console.log("response", response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedRoom, userData.user_token]);

  const handleText = async (e) => {
    e.preventDefault();
    if (message) {
      console.log("Message:", message);
      socket.emit("chat message", message);

      try {
        const userToken = userData.user_token;
        const selectedRoom = localStorage.getItem("group_room_number");
        const sendResponse = await axios.post(
          `/api/messages/send`,
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

        console.log("Send Response", sendResponse);

        if (sendResponse.status === 200 || sendResponse.status === 201) {
          const response = await axios.get(`messages`, {
            params: {
              text: message,
              user_token: userToken,
              group_room_number: selectedRoom,
            },
          });
          const newMessage = response.data;
          console.log("Response messsages", response);
          setChat((prevChat) => [...prevChat, newMessage]);
          console.log("newMessage:", newMessage);
        } else {
          console.error("Error sending message:", sendResponse.status);
        }
        setMessage("");
      } catch (error) {
        if (error.message.includes("Error sending message to backend")) {
          console.error("Error sending message to backend:", error);
        } else if (error.message.includes("NS_BINDING_ABORTED")) {
          console.error("NS_BINDING_ABORTED:", error);
        } else {
          console.error("Error sending message:", error);
        }
      } 
      }
    };

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log("handlesearch started")
    try {
      const selectedRoom = localStorage.getItem("group_room_number");
      console.log("selectedRoom: search feat ", selectedRoom);
      const user_token = userData.userToken
      const response = await axios.get(`/api/search?term=${searchTerm}`, {
         headers: {
           Authorization: `${userData.user_token}`,
        },
        params: {
          user_token: user_token,
          group_room_number: selectedRoom,
          searchTerm: searchTerm,
        },
      });
      console.log("searchTerm: ", searchTerm)
      setSearchResults(response.data);
      console.log("response.data search results: ", response.data);
    } catch (error) {
      if (error.response) {
        console.log("Data: ", error.response.data);
        console.log("status", error.response.status);
        console.log("Headers", error.response.headers);
        console.log("Token", userData.user_token);
        console.error('Error in handleSearch:', error);
      } else if (error.request) {
        console.error("No Response received: ", error.request);
      } else {
        console.error("Error: ", error.message);
      }
    }
  };

  const highlightText = (text, searchTerm) => {
    if (!searchTerm.trim()) return text;
    console.log("highlight text: ", text);
    const regex = new RegExp(`(${searchTerm})`, "gi");
    console.log("regex text: ", regex);
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="highlight">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  useEffect(() => {
    console.log("useEffect socket");
    socket.on("chat message", (newMessage) => {
      setChat((prevChat) => [...prevChat, newMessage]);
    });

    return () => {
      socket.off("chat message");
    };
  });

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
    console.log("useEffect socket on");
    socket.on("backend_to_frontend", (message) => {
      console.log("Received message from backend:", message);
    });

    return () => {
      socket.off("backend_to_frontend");
    };
  });

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
        <form className="search-container" onInput={handleSearch}>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="search-icon"
          />
          <input
            type="text"
            value={searchTerm}
            onInput={(e) => {
              setSearchTerm(e.target.value);
            }}
            placeholder="Search"
            aria-label="Search"
            name="search"
            className="input-box"
          />
        </form>
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
          <button className="logout_button" onClick={userLogout}>
            <p className="logout_text">Log Out</p>
          </button>
        </div>
      </div>
      <div className={`input_chat_box ${currentThemeClasses.secondaryColor}`}>
        <div className="group_box">
          <FontAwesomeIcon icon={faUserGroup} className="profile_box_image" />
          <p className="profile_box_text">{selectedRoomName}</p>
        </div>
        <div className="chat-wrapper" key={userData.user_id}>
          <div className="chat-container">
            {selectedRoom && (
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
                        {searchResults.length > 0
                          ? highlightText(message.text, searchTerm)
                          : message.text}
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
          onsubmit={"return false"}
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
          <button type="button" className="input_message_button">
            <FontAwesomeIcon icon={faArrowAltCircleRight} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MainPage;
