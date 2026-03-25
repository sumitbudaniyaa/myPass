import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import Login from "@/components/login";
import { MapPinned } from "lucide-react";
import { formatTo12Hour } from "@/utils/formattime";
import { Clock } from "lucide-react";
import Footer from "@/components/footer";
import { MoveRight } from "lucide-react";
import api from "@/utils/api";
import { ChevronLeft } from "lucide-react";

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

  const getQuantity = (ticketId: string) => {
    const item = cart.find((t) => t.ticketId === ticketId);
    return item ? item.ticketQuantity : 0;
  };

  const handleAddToCart = (ticket: any) => {
    setcart([
      ...cart,
      {
        ticketName: ticket.ticketName,
        ticketPrice: ticket.price,
        ticketQuantity: 1,
        ticketId: ticket._id,
      },
    ]);
  };

  const incrementTicket = (ticketId: string) => {
    setcart((prevCart) =>
      prevCart.map((item) =>
        item.ticketId === ticketId
          ? { ...item, ticketQuantity: item.ticketQuantity + 1 }
          : item
      )
    );
  };

  const decrementTicket = (ticketId: string) => {
    setcart((prevCart) => {
      const updatedCart = prevCart
        .map((item) =>
          item.ticketId === ticketId
            ? { ...item, ticketQuantity: item.ticketQuantity - 1 }
            : item
        )
        .filter((item) => item.ticketQuantity > 0);
      return updatedCart;
    });
  };

  const fetchEventDetails = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/fetchEventDetail`,
        {
          eventId,
        }
      );

      setEventDetail(res.data.event);
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const bookTicket = async () => {
    try {
      if (token) {
        const expandedTickets: expandedTicket[] = [];
        cart.forEach((item) => {
          for (let i = 0; i < item.ticketQuantity; i++) {
            expandedTickets.push({
              ticketName: item.ticketName,
              ticketPrice: item.ticketPrice,
            });
          }
        });
        const payload = {
          eventid: eventId,
          eventName: eventDetail.name,
          eventPoster: eventDetail.poster,
          totalPrice: cart.reduce(
            (sum, t) => sum + t.ticketPrice * t.ticketQuantity,
            0
          ),
          totalTickets: cart.reduce((sum, t) => sum + t.ticketQuantity, 0),
          tickets: expandedTickets,
          payStatus: false,
        };
        const res = await api.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/createBooking`,
          payload
        );

        navigate("/checkout", { state: res.data });
      } else {
        setisLogInOpen(true);
        toast.error("Please LogIn");
      }
    } catch (err: any) {
      toast.error(err);
    } finally {
    }
  };

  return (
    <>
      <div className="w-screen h-[7vh] sticky top-0 flex pl-2 pr-2 items-center gap-2 backdrop-blur-lg">
        {" "}
        <ChevronLeft
          onClick={() => navigate("/")}
          className="text-[rgba(255,255,255,0.5)]"
        />
        <div
          onClick={() => navigate("/")}
          className="shape bg-[rgba(255,255,255,0.5)] w-7 ml-auto"
        ></div>
        {token ? (
          ""
        ) : (
          <button
            onClick={() => setisLogInOpen(true)}
            className="ml-auto bg-[rgba(255,255,255,0.2)] rounded-md p-1 text-[rgba(255,255,255,0.8)] text-sm"
          >
            Log In
          </button>
        )}
      </div>

      <div className="w-screen min-h-screen flex flex-col items-center">
        <Toaster position="top-center" />

        {loading ? (
          <div className="flex flex-row gap-2">
            <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-.5s]"></div>
          </div>
        ) : (
          <div className="flex flex-col items-center w-[100%] lg:flex-row lg:items-start lg:w-[75%] p-4">
            <div className="flex flex-col items-center w-[100%] gap-3 lg:w-[50%] lg:items-start">
              <img
                src={eventDetail?.poster}
                className="rounded-lg w-[100%] lg:w-[80%]"
                alt=""
              />

              <p className="w-[100%] text-3xl font-semibold text-[rgba(255,255,255,0.8)]">
                {eventDetail?.name}
              </p>
              <p className="p-1 pl-1.5 pr-1.5 text-sm bg-blue-950/70 text-[rgba(255,255,255,0.8)] rounded-md self-start">
                {eventDetail?.category}
              </p>
              {eventDetail?.ageLimit && (
                <p className="p-1 pl-1.5 pr-1.5 text-sm bg-red-950/70 text-[rgba(255,255,255,0.8)] rounded-md self-start">
                  {eventDetail?.ageLimit}+
                </p>
              )}

              <p className="w-[100%] flex gap-2 items-center text-[rgba(255,255,255,0.8)] text-lg">
                <Calendar size={"1.5rem"} strokeWidth={"1px"} color="grey" />{" "}
                {eventDetail?.date &&
                  new Date(eventDetail?.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
              </p>

              <p className="w-[100%] flex gap-2 items-center text-[rgba(255,255,255,0.8)] text-lg">
                <Clock size={"1.5rem"} strokeWidth={"1px"} color="grey" />{" "}
                {eventDetail?.time && formatTo12Hour(eventDetail?.time)} onwards
              </p>

              <p className="w-[100%] flex gap-2 items-center text-[rgba(255,255,255,0.8)] text-lg">
                <MapPinned size={"1.5rem"} strokeWidth={"1px"} color="grey" />{" "}
                {eventDetail?.venue}, {eventDetail?.city}
              </p>

              <div className="flex flex-col w-[100%] mt-2">
                <p className="text-[rgba(255,255,255,0.5)] text-md border-b-1 border-[rgba(255,255,255,0.2)]">
                  About the event
                </p>

                <p className="text-[rgba(255,255,255,0.8)] whitespace-pre-line text-md p-1 pt-2">
                  {eventDetail?.description}
                </p>
              </div>
            </div>

            <div className="w-[100%] lg:w-[50%] mt-5 bg-[rgba(255,255,255,0.1)] rounded-lg">
              <p className="text-[rgba(255,255,255,0.6)] text-sm bg-[rgba(21,21,21,0.4)] rounded-t-lg p-1.5">
                Tickets
              </p>
              {eventDetail?.tickets.map((ticket: any, index: number) => {
                const quantity = getQuantity(ticket?._id);

                const isSoldOut = ticket.totalTickets === ticket.bookedTickets;

                const noMoreTics =
                  ticket.totalTickets - ticket.bookedTickets === quantity;

                const aFewLeft = ticket.totalTickets - ticket.bookedTickets < 5;

                return (
                  <div
                    key={index}
                    className="w-[100%] flex rounded-md items-center gap-1 p-1.5"
                  >
                    <div className="w-[100%] text-[rgba(255,255,255,0.8)] relative rounded-sm flex items-center p-3 lg:p-4 justify-between bg-[rgba(21,21,21,0.8)]">
                      <div className="flex flex-col justify-center">
                        <p className="text-md">{ticket.ticketName}</p>
                        <p className="text-lg font-semibold">₹{ticket.price}</p>
                      </div>

                      {!noMoreTics &&
                        (aFewLeft ? (
                          <div className="bg-red-900/50 text-red-400 pl-1 pr-1 p-1 rounded-md text-xs">
                            Only a few left
                          </div>
                        ) : (
                          ""
                        ))}

                      {isSoldOut ? (
                        <h1>Sold Out</h1>
                      ) : quantity > 0 ? (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => decrementTicket(ticket._id)}
                            className="border-1 border-[rgba(255,255,255,0.5)] cursor-pointer p-1 pl-2 pr-2 rounded-lg"
                          >
                            -
                          </button>
                          <p className="font-semibold">{quantity}</p>
                          {noMoreTics ? (
                            <h1 className="text-xs">Sold Out</h1>
                          ) : (
                            <button
                              onClick={() => incrementTicket(ticket._id)}
                              className={`border-1 border-[rgba(255,255,255,0.5)] cursor-pointer p-1 pl-2 pr-2 rounded-lg ${
                                noMoreTics ? "pointer-events-none" : ""
                              }`}
                            >
                              +
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(ticket)}
                          className="bg-green-800/70 p-1 px-3 rounded-lg cursor-pointer"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {cart.length > 0 && (
                <button
                  onClick={bookTicket}
                  className="bg-green-800/70 cursor-pointer text-lg outline-none w-[100%] mt-2 flex justify-center p-3 rounded-sm items-center gap-2 text-green-200"
                >
                  Book Tickets <MoveRight />
                </button>
              )}
            </div>
          </div>
        )}

        {isLogInOpen && (
          <>
            <div
              onClick={() => setisLogInOpen(false)}
              className="inset-0 z-40 flex justify-center items-center backdrop-blur-sm bg-black/40 fixed"
            />
            <Login />
          </>
        )}

        <Footer />
      </div>
    </>
  );
};

export default EventPage;
