import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserSafe = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault();
      alert("You must log in to access Voca");
      navigate("/");
    };

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate]);

  return null;
};

export default UserSafe;
