import { useEffect } from "react";

const LoggingIn = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      const lastPath = sessionStorage.getItem("lastPath") || "/";
      sessionStorage.removeItem("lastPath");
      window.location.replace(lastPath);
    } else {
      window.location.replace("/");
    }
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center gap-2">
      <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce"></div>
      <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-.3s]"></div>
      <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-.5s]"></div>
    </div>
  );
};

export default LoggingIn;
