import api from "@/utils/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type BookingsProp = {
  eventId: string;
};

const Bookings = ({ eventId }: BookingsProp) => {
  const [bookings, setbookings] = useState<any>(null);
  const [isLoading, setisLoading] = useState<boolean>(true);

  const fetchBookings = async () => {
    try {
      const res = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/eventRoute/fetchBookings`,
        {
          eventId,
        }
      );
      setbookings(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [eventId]);

  return (
    <div className="w-full bg-[rgba(255,255,255,0.1)] rounded-md mt-2 p-4 overflow-x-auto">
      {isLoading ? (
        <div className="flex flex-row gap-2">
          <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce"></div>
          <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-.3s]"></div>
          <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-.5s]"></div>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20 text-left">
              <th className="py-2 px-4 text-[rgba(255,255,255,0.5)] font-semibold">
                Name
              </th>
              <th className="py-2 px-4 text-[rgba(255,255,255,0.5)] font-semibold">
                Email
              </th>
              <th className="py-2 px-4 text-[rgba(255,255,255,0.5)] font-semibold">
                Phone
              </th>
              <th className="py-2 px-4 text-[rgba(255,255,255,0.5)] font-semibold">
                Amount
              </th>
              <th className="py-2 px-4 text-[rgba(255,255,255,0.5)] font-semibold">
                Quantity
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings?.map((booking: any, index: number) => (
              <tr
                key={index}
                className="hover:bg-[rgba(255,255,255,0.1)] transition-all"
              >
                <td className="py-2 px-4 text-[rgba(255,255,255,0.8)]">
                  {booking?.userid?.name}
                </td>
                <td className="py-2 px-4 text-[rgba(255,255,255,0.8)]">
                  {booking?.userid?.email}
                </td>
                <td className="py-2 px-4 text-[rgba(255,255,255,0.8)]">
                  {booking?.phone}
                </td>
                <td className="py-2 px-4 text-[rgba(255,255,255,0.8)]">
                  ₹{booking?.totalPrice}
                </td>
                <td className="py-2 px-4 text-[rgba(255,255,255,0.8)]">
                  {booking?.totalTickets}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Bookings;
