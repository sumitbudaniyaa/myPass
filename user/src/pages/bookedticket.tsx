import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { formatTo12Hour } from "@/utils/formattime";
import { Calendar, Clock, MapPinned } from "lucide-react";
import { ChevronLeft } from "lucide-react";

const BookedTicket = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state;
  const [event, setevent] = useState<any>(null);
  const [loading, setloading] = useState<boolean>(true);

  const fetchEventDetail = async () => {
    try {
      const res = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/fetchEventDetail`,
        {
          eventId: booking.eventid,
        }
      );
      setevent(res.data.event);
    } catch (err: any) {
      toast.error(err);
      setloading(false);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchEventDetail();
  }, [booking]);

  return (
    <div className="flex flex-col items-center w-screen min-h-screen">
      <div className="w-screen h-[7vh] sticky top-0 flex pl-3 pr-2 items-center gap-2 backdrop-blur-lg">
        {" "}
        <ChevronLeft
          onClick={() => navigate("/my-bookings")}
          className="text-[rgba(255,255,255,0.5)] cursor-pointer"
          size={"1.2rem"}
        />
        <p className="text-[rgba(255,255,255,0.5)]">{booking?.eventName}</p>
        <div
          onClick={() => navigate("/")}
          className="shape bg-[rgba(255,255,255,0.5)] w-6 ml-auto"
        ></div>
      </div>

      {loading ? (
        <div className="flex flex-row gap-2">
          <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce"></div>
          <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-.3s]"></div>
          <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-.5s]"></div>
        </div>
      ) : (
        <div className="flex flex-col w-[100%] lg:w-[50%] p-3 gap-2">
          <p className="text-xl text-[rgba(255,255,255,0.5)]">Ticket details</p>

          {booking?.tickets?.map((ticket: any, index: any) => (
            <div key={index} className="w-[100%] rounded-lg p-1.5 flex">
              <div className="bg-[rgba(255,255,255,0.1)] flex items-center p-4 w-[45%] justify-center rounded-3xl">
                <img
                  src={ticket?.qrImage}
                  className="rounded-2xl w-[100%]"
                  alt=""
                />
              </div>
              <div className="flex flex-col items-end p-3.5 w-[55%] justify-end bg-[rgba(255,255,255,0.1)] rounded-3xl">
                <p className="mb-auto text-xs text-[rgba(255,255,255,0.3)]">
                  mypass.live
                </p>
                <p className="text-[rgba(255,255,255,0.8)] text-xl">
                  {ticket?.ticketName}
                </p>
                <p className="text-[rgba(255,255,255,0.8)] text-2xl font-semibold">
                  ₹{ticket?.ticketPrice}
                </p>
              </div>
            </div>
          ))}

          <div className="flex justify-between p-3 border-t-1 border-[rgba(255,255,255,0.1)]">
            <p className="text-[rgba(255,255,255,0.4)] text-sm font-light">
              Total Tickets{" "}
              <span className="text-[rgba(255,255,255,0.8)] text-xl font-semibold">
                {booking?.totalTickets}
              </span>
            </p>
            <p className="text-[rgba(255,255,255,0.4)] text-sm font-light">
              Total amount{" "}
              <span className="text-[rgba(255,255,255,0.8)] text-xl font-semibold">
                ₹{booking?.totalPrice}
              </span>
            </p>
          </div>

          <div className="flex border-1 border-[rgba(255,255,255,0.1)] rounded-lg p-2 items-center  mt-3">
            <img
              src={booking?.eventPoster}
              alt=""
              className="rounded-lg w-[25%] lg:w-[20%]"
            />

            <div className="flex flex-col gap-2 w-[75%] lg:w-[80%] items-end p-1">
              <p className="flex gap-2 items-center text-[rgba(255,255,255,0.8)] lg:text-xl sm:text-lg">
                <Calendar size={"1.2rem"} strokeWidth={"1px"} color="grey" />{" "}
                {event?.date &&
                  new Date(event?.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
              </p>

              <p className="flex gap-2 items-center text-[rgba(255,255,255,0.8)] lg:text-xl sm:text-lg text-right">
                <Clock size={"1.2rem"} strokeWidth={"1px"} color="grey" />{" "}
                {event?.time && formatTo12Hour(event?.time)} onwards
              </p>

              <p className="flex gap-2 items-center text-[rgba(255,255,255,0.8)] lg:text-xl sm:text-lg">
                <MapPinned size={"1.2rem"} strokeWidth={"1px"} color="grey" />{" "}
                {event?.venue}, {event?.city}
              </p>
            </div>
          </div>

          <p className="self-center text-[rgba(255,255,255,0.5)] w-[50%] text-center text-xs font-light mt-2 mb-2">
            Thank you for booking with us! If you have any questions or
            concerns, feel free to contact us.
          </p>
        </div>
      )}
    </div>
  );
};

export default BookedTicket;
