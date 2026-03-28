import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Ticket } from "lucide-react";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

const MyBookings = () => {
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const res = await api.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/fetchBookings`);
      return res.data;
    } catch (err: any) {
      toast.error(err);
    }
  };

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <>
      <div className="w-screen h-[7vh] sticky top-0 flex px-3 items-center gap-2 backdrop-blur-lg border-b border-white/[0.06] z-50">
        <button onClick={() => navigate("/")} className="text-white/40 hover:text-white/70 transition-colors cursor-pointer">
          <ChevronLeft size="1.2rem" />
        </button>
        <p className="text-white/65 text-sm font-medium">My Bookings</p>
        <img onClick={() => navigate("/")} src="/mypasslogo.png" className="w-6 h-6 object-contain ml-auto cursor-pointer" alt="myPass" />
      </div>

      <div className="w-full sm:w-[70%] lg:w-[44%] mx-auto min-h-screen flex flex-col p-4 gap-3 pb-8">
        {isLoading ? (
          <div className="flex justify-center mt-20">
            <div className="flex gap-2">
              {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
            </div>
          </div>
        ) : bookings.length !== 0 ? (
          <>
            <p className="text-white/30 text-xs font-medium uppercase tracking-wider">{bookings.length} booking{bookings.length !== 1 ? "s" : ""}</p>
            {bookings.map((booking: any, index: number) => (
              <div
                key={index}
                onClick={() => navigate(`/my-bookings/${booking._id}`, { state: booking })}
                className="w-full cursor-pointer bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] hover:border-white/[0.12] rounded-2xl flex gap-3 p-3 transition-all duration-200"
              >
                <img src={booking?.eventPoster} className="w-20 h-24 object-cover rounded-xl shrink-0" alt="" />
                <div className="flex flex-col flex-1 min-w-0 py-0.5">
                  <p className="text-white/85 font-semibold text-base truncate">{booking?.eventName}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Ticket size="0.7rem" className="text-white/25" />
                    <p className="text-white/35 text-xs">
                      {booking?.totalTickets} {booking?.totalTickets === 1 ? "ticket" : "tickets"}
                    </p>
                  </div>
                  <p className="text-white/65 text-sm font-semibold mt-auto">₹{booking?.totalPrice}</p>
                </div>
                <ChevronRight size="1rem" className="text-white/20 self-center shrink-0" />
              </div>
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center mt-24 gap-3">
            <p className="text-white/20 text-4xl">🎟</p>
            <p className="text-white/35 text-sm font-medium">No bookings yet</p>
            <button
              onClick={() => navigate("/")}
              className="mt-1 px-4 py-2 bg-white/[0.06] hover:bg-white/10 border border-white/[0.08] rounded-full text-white/45 text-xs transition-all cursor-pointer"
            >
              Browse events
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default MyBookings;
