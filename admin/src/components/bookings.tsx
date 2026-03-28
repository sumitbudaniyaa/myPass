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
      const res = await api.post(`${import.meta.env.VITE_BACKEND_URL}/api/eventRoute/fetchBookings`, { eventId });
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

  if (isLoading) {
    return (
      <div className="flex gap-1.5 justify-center py-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl px-4 py-8 text-center">
        <p className="text-white/25 text-sm">No bookings yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl overflow-hidden">
      {/* Mobile card view */}
      <div className="divide-y divide-white/[0.05] sm:hidden">
        {bookings.map((booking: any, index: number) => (
          <div key={index} className="px-4 py-3 flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <p className="text-white/80 text-sm font-medium">{booking?.userid?.name}</p>
              <span className="text-white/60 text-sm font-semibold">₹{booking?.totalPrice}</span>
            </div>
            <p className="text-white/40 text-xs">{booking?.userid?.email}</p>
            <div className="flex justify-between items-center mt-1">
              <p className="text-white/35 text-xs">{booking?.phone}</p>
              <span className="text-white/40 text-xs">{booking?.totalTickets} ticket{booking?.totalTickets !== 1 ? "s" : ""}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.07]">
              <th className="py-3 px-4 text-white/35 text-xs font-medium text-left uppercase tracking-wider">Name</th>
              <th className="py-3 px-4 text-white/35 text-xs font-medium text-left uppercase tracking-wider">Email</th>
              <th className="py-3 px-4 text-white/35 text-xs font-medium text-left uppercase tracking-wider">Phone</th>
              <th className="py-3 px-4 text-white/35 text-xs font-medium text-right uppercase tracking-wider">Amount</th>
              <th className="py-3 px-4 text-white/35 text-xs font-medium text-right uppercase tracking-wider">Qty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {bookings.map((booking: any, index: number) => (
              <tr key={index} className="hover:bg-white/[0.03] transition-all">
                <td className="py-3 px-4 text-white/75 text-sm">{booking?.userid?.name}</td>
                <td className="py-3 px-4 text-white/55 text-sm">{booking?.userid?.email}</td>
                <td className="py-3 px-4 text-white/55 text-sm">{booking?.phone}</td>
                <td className="py-3 px-4 text-white/75 text-sm font-medium text-right">₹{booking?.totalPrice}</td>
                <td className="py-3 px-4 text-white/55 text-sm text-right">{booking?.totalTickets}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;
