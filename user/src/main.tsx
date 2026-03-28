import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Handle Google OAuth callback before React Router gets involved
if (window.location.pathname === "/auth" || window.location.pathname === "/auth/") {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (token) {
    localStorage.setItem("token", token);
    const lastPath = sessionStorage.getItem("lastPath") || "/";
    sessionStorage.removeItem("lastPath");
    window.location.replace(lastPath);
  }
}

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>
  </BrowserRouter>
);
