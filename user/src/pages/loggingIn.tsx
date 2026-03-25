import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoggingIn = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params?.get("token");
    if (token) {
      localStorage.setItem("token", token);
      const lastPath = sessionStorage.getItem("lastPath");
      navigate(`${lastPath}`);
    }
  }, []);

  return <h1>Logging you in...</h1>;
};

export default LoggingIn;
