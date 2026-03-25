import { Route, Routes } from "react-router-dom";

import Login from "./pages/login";
import Home from "./pages/home";
import ProtectedRoute from "./components/protectedroute";
import ScanPage from "./pages/scanner";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/scan/:eventName/:eventId"
        element={
          <ProtectedRoute>
            <ScanPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
