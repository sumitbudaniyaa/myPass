import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

const MyBookings = () => {
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const res = await api.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/fetchBookings`
      );

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
      <div className="w-screen h-[7vh] sticky top-0 flex pl-2 pr-2 items-center gap-2 backdrop-blur-lg">
        {" "}
        <ChevronLeft
          onClick={() => navigate("/")}
          className="text-[rgba(255,255,255,0.5)] cursor-pointer"
          size={"1.2rem"}
        />
        <p className="text-[rgba(255,255,255,0.5)]">My Bookings</p>
        <div
          onClick={() => navigate("/")}
          className="shape bg-[rgba(255,255,255,0.5)] w-6 ml-auto"
        ></div>
      </div>

      <div className="w-screen min-h-screen flex flex-col p-6 gap-3">
        {isLoading ? (
          <div className="w-full backdrop-blur-lg flex items-center justify-center">
            <div className="flex flex-row gap-2">
              <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-.5s]"></div>
            </div>
          </div>
        ) : bookings.length !== 0 ? (
          bookings.map((booking: any, index: any) => (
            <div
              className="w-[100%] shrink-0 p-2 bg-[rgba(255,255,255,0.1)] rounded-lg flex gap-3 max-h-50 lg:max-h-60 cursor-pointer sm:w-[60%] lg:w-[40%] sm:self-center lg:self-center"
              onClick={() =>
                navigate(`/my-bookings/${booking._id}`, { state: booking })
              }
              key={index}
            >
              <img
                src={booking?.eventPoster}
                className="w-[40%] sm:w-[35%] lg:w-[30%] rounded-lg max-h-30 lg:max-h-60"
                alt=""
              />

              <div className="w-[60%] sm:w-[65%] lg:w-[70%] flex flex-col gap-1">
                <p className="text-[rgba(255,255,255,0.8)] w-[100%] text-2xl font-semibold">
                  {booking?.eventName}
                </p>
                <div className="text-[rgba(255,255,255,0.8)] w-[100%] flex flex-col mt-auto items-end">
                  {" "}
                  <span className="text-4xl">{booking?.totalTickets}</span>{" "}
                  <p className="text-xs text-[rgba(255,255,255,0.4)]">
                    Total tickets
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full h-100 flex items-center justify-center">
            <p className="text-[rgba(255,255,255,0.5)]">No bookings yet</p>
          </div>
        )}
      </div>
    </>
  );
};

export default MyBookings;
