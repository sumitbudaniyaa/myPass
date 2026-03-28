import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import LoggingIn from "./pages/loggingIn";
import EventPage from "./pages/eventPage";
import CheckOutPage from "./pages/checkoutpage";
import Confirmation from "./pages/confirmation";
import BookedTicket from "./pages/bookedticket";
import MyBookings from "./pages/mybookings";
import Account from "./pages/account";
import ProtectedRoute from "./components/protectedroute";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<LoggingIn />} />
        <Route path="/auth/" element={<LoggingIn />} />
        <Route path="/:eventId" element={<EventPage />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckOutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking-confirmation"
          element={
            <ProtectedRoute>
              <Confirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings/:_id"
          element={
            <ProtectedRoute>
              <BookedTicket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
