import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Calendar, MapPinned, Clock, MoveRight, ChevronLeft, Share2 } from "lucide-react";
import Login from "@/components/login";
import { formatTo12Hour } from "@/utils/formattime";
import Footer from "@/components/footer";
import api from "@/utils/api";

type expandedTicket = {
  ticketName: string;
  ticketPrice: Number;
};

const EventPage = () => {
  const { eventId } = useParams();
  const [loading, setloading] = useState<boolean>(true);
  const [eventDetail, setEventDetail] = useState<any>(null);
  const navigate = useNavigate();
  const [isLogInOpen, setisLogInOpen] = useState<boolean>(false);
  const token = localStorage.getItem("token");
  const [cart, setcart] = useState<any[]>([]);

  const getQuantity = (ticketId: string) => cart.find((t) => t.ticketId === ticketId)?.ticketQuantity ?? 0;

  const handleAddToCart = (ticket: any) => {
    setcart([...cart, { ticketName: ticket.ticketName, ticketPrice: ticket.price, ticketQuantity: 1, ticketId: ticket._id }]);
  };

  const incrementTicket = (ticketId: string) => {
    setcart((prev) => prev.map((item) => item.ticketId === ticketId ? { ...item, ticketQuantity: item.ticketQuantity + 1 } : item));
  };

  const decrementTicket = (ticketId: string) => {
    setcart((prev) => prev.map((item) => item.ticketId === ticketId ? { ...item, ticketQuantity: item.ticketQuantity - 1 } : item).filter((item) => item.ticketQuantity > 0));
  };

  const fetchEventDetails = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/fetchEventDetail`, { eventId });
      setEventDetail(res.data.event);
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => { fetchEventDetails(); }, [eventId]);

  const cartTotal = cart.reduce((sum, t) => sum + t.ticketPrice * t.ticketQuantity, 0);
  const cartQty = cart.reduce((sum, t) => sum + t.ticketQuantity, 0);

  const bookTicket = async () => {
    try {
      if (token) {
        const expandedTickets: expandedTicket[] = [];
        cart.forEach((item) => {
          for (let i = 0; i < item.ticketQuantity; i++) {
            expandedTickets.push({ ticketName: item.ticketName, ticketPrice: item.ticketPrice });
          }
        });
        const payload = {
          eventid: eventId,
          eventName: eventDetail.name,
          eventPoster: eventDetail.poster,
          totalPrice: cartTotal,
          totalTickets: cartQty,
          tickets: expandedTickets,
          payStatus: false,
        };
        const res = await api.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/createBooking`, payload);
        navigate("/checkout", { state: res.data });
      } else {
        setisLogInOpen(true);
        toast.error("Please log in to book");
      }
    } catch (err: any) {
      toast.error(err);
    }
  };

  return (
    <>
      {/* Nav bar */}
      <div className="w-screen h-[7vh] sticky top-0 flex px-3 items-center gap-2 backdrop-blur-lg border-b border-white/[0.06] z-50">
        <button onClick={() => navigate("/")} className="text-white/40 hover:text-white/70 transition-colors cursor-pointer">
          <ChevronLeft size="1.2rem" />
        </button>
        <img onClick={() => navigate("/")} src="/mypasslogo.png" className="w-6 h-6 object-contain ml-auto cursor-pointer" alt="myPass" />
        {!token && (
          <button
            onClick={() => setisLogInOpen(true)}
            className="ml-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-full px-3 py-1 text-white/80 text-xs transition-all cursor-pointer"
          >
            Log In
          </button>
        )}
      </div>

      <div className="w-screen min-h-screen flex flex-col">
        <Toaster position="top-center" />

        {loading ? (
          <div className="flex justify-center mt-20">
            <div className="flex gap-2">
              {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-full lg:flex-row lg:w-[76%] lg:self-center p-4 gap-6 pb-8">
            {/* Left: Event info */}
            <div className="flex flex-col gap-5 w-full lg:w-[55%]">
              {/* Poster */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
                <img src={eventDetail?.poster} className="w-full object-cover max-h-96" alt={eventDetail?.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <button
                  onClick={() => navigator.share?.({ title: eventDetail?.name, url: window.location.href }).catch(() => {})}
                  className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-sm rounded-full text-white/60 hover:text-white/90 transition-colors cursor-pointer"
                >
                  <Share2 size="0.9rem" />
                </button>
              </div>

              {/* Name + badges */}
              <div>
                <h1 className="text-3xl font-bold text-white/90 leading-tight">{eventDetail?.name}</h1>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2.5 py-1 text-xs bg-blue-950/80 text-blue-300 rounded-full border border-blue-800/30 capitalize">
                    {eventDetail?.category}
                  </span>
                  {eventDetail?.ageLimit && (
                    <span className="px-2.5 py-1 text-xs bg-red-950/80 text-red-300 rounded-full border border-red-800/30">
                      {eventDetail?.ageLimit}+
                    </span>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl divide-y divide-white/[0.06]">
                <div className="flex items-center gap-3 px-4 py-3">
                  <Calendar size="0.9rem" strokeWidth="1.5" className="text-white/25 shrink-0" />
                  <p className="text-white/65 text-sm">
                    {eventDetail?.date && new Date(eventDetail.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-3 px-4 py-3">
                  <Clock size="0.9rem" strokeWidth="1.5" className="text-white/25 shrink-0" />
                  <p className="text-white/65 text-sm">{eventDetail?.time && formatTo12Hour(eventDetail.time)} onwards</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-3">
                  <MapPinned size="0.9rem" strokeWidth="1.5" className="text-white/25 shrink-0" />
                  <p className="text-white/65 text-sm">{eventDetail?.venue}, {eventDetail?.city}, {eventDetail?.state}</p>
                </div>
              </div>

              {/* About */}
              <div>
                <p className="text-white/30 text-xs font-medium uppercase tracking-wider mb-2">About</p>
                <p className="text-white/65 text-sm leading-relaxed whitespace-pre-line">{eventDetail?.description}</p>
              </div>
            </div>

            {/* Right: Ticket selector (sticky on desktop) */}
            <div className="w-full lg:w-[45%]">
              <div className="lg:sticky lg:top-[calc(7vh+1rem)]">
                <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl overflow-hidden">
                  <p className="text-white/35 text-xs font-medium uppercase tracking-wider px-4 py-3 border-b border-white/[0.06]">
                    Select Tickets
                  </p>

                  <div className="flex flex-col gap-1 p-2">
                    {eventDetail?.tickets.map((ticket: any, index: number) => {
                      const quantity = getQuantity(ticket?._id);
                      const isSoldOut = ticket.totalTickets === ticket.bookedTickets;
                      const remaining = ticket.totalTickets - ticket.bookedTickets;
                      const noMoreTics = remaining === quantity;
                      const aFewLeft = remaining < 5 && remaining > 0;

                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]"
                        >
                          <div>
                            <p className="text-white/80 text-sm font-medium">{ticket.ticketName}</p>
                            <p className="text-white/90 text-lg font-semibold">₹{ticket.price}</p>
                            {!isSoldOut && aFewLeft && !noMoreTics && (
                              <p className="text-orange-400 text-xs mt-0.5">Only {remaining} left</p>
                            )}
                          </div>

                          {isSoldOut ? (
                            <span className="text-white/30 text-xs bg-white/[0.05] px-3 py-1 rounded-full border border-white/[0.07]">
                              Sold Out
                            </span>
                          ) : quantity > 0 ? (
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => decrementTicket(ticket._id)}
                                className="w-8 h-8 flex items-center justify-center border border-white/15 rounded-full text-white/60 hover:bg-white/10 transition-all cursor-pointer text-lg leading-none"
                              >
                                −
                              </button>
                              <span className="text-white/90 font-semibold w-4 text-center tabular-nums">{quantity}</span>
                              {noMoreTics ? (
                                <span className="text-white/25 text-xs w-8 text-center">Max</span>
                              ) : (
                                <button
                                  onClick={() => incrementTicket(ticket._id)}
                                  className="w-8 h-8 flex items-center justify-center border border-white/15 rounded-full text-white/60 hover:bg-white/10 transition-all cursor-pointer text-lg leading-none"
                                >
                                  +
                                </button>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(ticket)}
                              className="px-4 py-1.5 bg-green-900/60 hover:bg-green-800/70 text-green-300 text-sm rounded-lg cursor-pointer transition-all border border-green-700/30"
                            >
                              Add
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {cart.length > 0 && (
                    <div className="p-2 pt-0">
                      <button
                        onClick={bookTicket}
                        className="w-full bg-green-900/70 hover:bg-green-800/80 cursor-pointer text-green-100 flex justify-between items-center px-4 py-3 rounded-xl transition-all border border-green-700/30"
                      >
                        <div>
                          <span className="font-medium text-sm">Book Tickets</span>
                          <span className="text-green-400 text-xs ml-2">({cartQty})</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-300">
                          <span className="font-semibold">₹{cartTotal}</span>
                          <MoveRight size="1rem" />
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {isLogInOpen && (
          <>
            <div onClick={() => setisLogInOpen(false)} className="inset-0 z-[40] flex justify-center items-center backdrop-blur-sm bg-black/50 fixed" />
            <Login />
          </>
        )}

        <Footer />
      </div>
    </>
  );
};

export default EventPage;
