import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Home from "./components/home";
import Account from "./components/account";
import Payments from "./components/payments";
import ProtectedRoute from "./components/protectedroute";
import SendMail from "./pages/sendmail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route path="events" element={<Home />} />
        <Route path="account" element={<Account />} />
        <Route path="payments" element={<Payments />} />
        <Route path="sendmail" element={<SendMail />} />
      </Route>
    </Routes>
  );
}

export default App;
