const Login = () => {
  const handleLogin = () => {
    sessionStorage.setItem("lastPath", window.location.pathname);
    window.open(
      `${import.meta.env.VITE_BACKEND_URL}/api/userAuth/auth/google`,
      "_self"
    );
  };

  return (
    <div className="bg-[rgba(255,255,255,0.2)] w-[100%] p-5 z-120 shadow-md fixed top-0 lg:w-[30%] sm:w-[50%] self-center flex justify-between items-center rounded-b-lg">
      <p className="text-[rgba(255,255,255,0.8)]">Log In using Google</p>
      <button
        onClick={handleLogin}
        className="p-1.5 bg-[rgba(255,255,255,0.3)] cursor-pointer text-[rgba(255,255,255,0.8)] text-sm rounded-sm"
      >
        Log In
      </button>
    </div>
  );
};

export default Login;
