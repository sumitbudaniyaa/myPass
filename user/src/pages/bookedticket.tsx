import { useNavigate, useLocation } from "react-router-dom";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { formatTo12Hour } from "@/utils/formattime";
import { Calendar, Clock, MapPinned, ChevronLeft, Download } from "lucide-react";

const BookedTicket = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state;
  const [event, setevent] = useState<any>(null);
  const [loading, setloading] = useState<boolean>(true);

  const fetchEventDetail = async () => {
    try {
      const res = await api.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/fetchEventDetail`, { eventId: booking.eventid });
      setevent(res.data.event);
    } catch (err: any) {
      toast.error(err);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => { fetchEventDetail(); }, [booking]);

  return (
    <div className="flex flex-col items-center w-screen min-h-screen">
      {/* Nav */}
      <div className="w-screen h-[7vh] sticky top-0 flex px-3 items-center gap-2 backdrop-blur-lg border-b border-white/[0.06] z-50">
        <button onClick={() => navigate("/my-bookings")} className="text-white/40 hover:text-white/70 transition-colors cursor-pointer">
          <ChevronLeft size="1.2rem" />
        </button>
        <p className="text-white/60 text-sm font-medium truncate">{booking?.eventName}</p>
        <img onClick={() => navigate("/")} src="/mypasslogo.png" className="w-6 h-6 object-contain ml-auto cursor-pointer shrink-0" alt="myPass" />
      </div>

      {loading ? (
        <div className="flex justify-center mt-20">
          <div className="flex gap-2">
            {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full lg:w-[46%] p-4 gap-4 pb-8">
          <p className="text-white/30 text-xs font-medium uppercase tracking-wider">Your Tickets</p>

          {/* Ticket cards */}
          {booking?.tickets?.map((ticket: any, index: number) => (
            <div key={index} className="w-full bg-white/[0.04] border border-white/[0.07] rounded-2xl overflow-hidden flex">
              {/* QR */}
              <div className="w-[42%] bg-white/[0.03] flex items-center justify-center p-4 shrink-0">
                <img src={ticket?.qrImage} className="rounded-xl w-full" alt="QR Code" />
              </div>

              {/* Divider */}
              <div className="flex flex-col justify-between items-center py-3 w-px relative">
                <div className="w-4 h-4 rounded-full bg-[#0a0a0a] border border-white/[0.07] -translate-x-1/2 absolute -top-2" />
                <div className="flex-1 border-l border-dashed border-white/[0.08]" />
                <div className="w-4 h-4 rounded-full bg-[#0a0a0a] border border-white/[0.07] -translate-x-1/2 absolute -bottom-2" />
              </div>

              {/* Info */}
              <div className="flex flex-col justify-between flex-1 p-4">
                <p className="text-white/15 text-[10px] font-medium tracking-wide">mypass.live</p>
                <div>
                  <p className="text-white/75 text-sm font-semibold">{ticket?.ticketName}</p>
                  <p className="text-white/90 text-2xl font-bold mt-0.5">₹{ticket?.ticketPrice}</p>
                </div>
                <p className="text-white/25 text-xs">#{booking?._id?.slice(-6).toUpperCase()}</p>
              </div>
            </div>
          ))}

          {/* Summary row */}
          <div className="flex justify-between px-1 py-4 border-y border-white/[0.06]">
            <div>
              <p className="text-white/25 text-xs mb-1">Total Tickets</p>
              <p className="text-white/80 text-xl font-bold">{booking?.totalTickets}</p>
            </div>
            <div className="text-right">
              <p className="text-white/25 text-xs mb-1">Total Paid</p>
              <p className="text-white/80 text-xl font-bold">₹{booking?.totalPrice}</p>
            </div>
          </div>

          {/* Event info card */}
          <div className="flex bg-white/[0.04] border border-white/[0.07] rounded-2xl overflow-hidden">
            <img src={booking?.eventPoster} alt="" className="w-20 h-24 object-cover shrink-0" />
            <div className="flex flex-col justify-center gap-2.5 p-3 flex-1">
              <p className="flex gap-2 items-start text-white/60 text-xs">
                <Calendar size="0.8rem" strokeWidth="1.5" className="text-white/25 shrink-0 mt-px" />
                {event?.date && new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
              <p className="flex gap-2 items-center text-white/60 text-xs">
                <Clock size="0.8rem" strokeWidth="1.5" className="text-white/25 shrink-0" />
                {event?.time && formatTo12Hour(event.time)} onwards
              </p>
              <p className="flex gap-2 items-start text-white/60 text-xs">
                <MapPinned size="0.8rem" strokeWidth="1.5" className="text-white/25 shrink-0 mt-px" />
                {event?.venue}, {event?.city}
              </p>
            </div>
          </div>

          <p className="self-center text-white/20 text-center text-xs font-light max-w-[65%]">
            Show this QR code at the event entry. Reach out to us if you need any help.
          </p>
        </div>
      )}
    </div>
  );
};

export default BookedTicket;
