import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

type prop = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: prop) => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("Please Login");
    return (
      <>
        <Navigate to="/" replace />{" "}
      </>
    );
  }
  return children;
};

export default ProtectedRoute;
