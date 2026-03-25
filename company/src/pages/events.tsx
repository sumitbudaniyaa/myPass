import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const Events = () => {
  const [events, setevents] = useState<any>(null);
  const [bookings, setbookings] = useState<any>(null);
  const [payments, setpayments] = useState<any>(null);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/company/fetchEvents`
      );

      setevents(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/company/fetchBookings`
      );

      setbookings(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/company/fetchPayments`
      );

      setpayments(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    }
  };

  const eventSettle = async (
    eventid: string,
    adminid: string,
    amount: number,
    requestId: string
  ) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/company/eventSettle`,
        {
          eventid: eventid,
          adminid: adminid,
          amount,
          requestId,
        }
      );

      toast.success(res.data.message);
      fetchEvents();
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    }
  };

  const rejectSettle = async (
    eventid: string,
    adminid: string,
    amount: number,
    requestId: string
  ) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/company/rejectSettle`,
        {
          eventid: eventid,
          adminid: adminid,
          amount,
          requestId,
        }
      );

      toast.success(res.data.message);
      fetchEvents();
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [events]);

  useEffect(() => {
    fetchPayments();
  }, [events]);

  return (
    <div className="w-screen min-h-screen overflow-y-auto flex flex-col lg:flex-row lg:flex-wrap gap-5 p-5 lg:pt-20 lg:pl-5">
      <Toaster position="top-center" />
      {events?.map((event: any, index: number) => (
        <div
          key={index}
          className="p-3 flex gap-2 flex-col rounded-md bg-white/10 min-w-50"
        >
          <p className="text-white text-lg">{event.name}</p>

          <p
            className={`${
              event.status === "upcoming" ? "text-green-500" : "text-red-500"
            }`}
          >
            {event.status}
          </p>

          <p className="text-lg font-semibold text-white flex gap-2 items-center">
            <span className="text-neutral-400 text-sm font-light">
              Total Sold
            </span>
            {event?.tickets?.reduce(
              (sum: number, ticket: any) => sum + ticket.bookedTickets,
              0
            )}
          </p>
          <p className="text-lg font-semibold text-white flex gap-2 items-center">
            <span className="text-neutral-400 text-sm font-light">
              Total Revenue
            </span>
            {bookings
              ?.filter((booking: any) => booking?.eventid === event._id)
              .reduce(
                (sum: number, booking: any) => sum + booking?.totalPrice,
                0
              )}
          </p>

          <p className="text-lg font-semibold text-white flex gap-2 items-center">
            <span className="text-neutral-400 text-sm font-light">
              Total Withdrawable amount
            </span>
            {event.totalWithdrawableAmount}
          </p>

          <p className="font-semibold text-white flex gap-2 items-center">
            <span className="text-neutral-400 text-sm font-light">UPI</span>
            {
              payments?.find((payment: any) => payment.adminid === event.by)
                ?.upi
            }
          </p>

          {payments
            ?.find((p: any) => p.adminid === event.by)
            ?.paymentRequests?.filter(
              (request: any) => request.eventId === event._id
            )
            .map((request: any, index: number) => (
              <div
                key={index}
                className="w-full bg-black/30 rounded-md text-white p-2 flex flex-col gap-2"
              >
                <p className="flex gap-2 text-white font-semibold items-center">
                  {" "}
                  <span className="text-neutral-400 text-sm font-light">
                    amount
                  </span>
                  ₹{request.amount}
                </p>

                {request.status === "pending" ? (
                  <div className="w-full flex flex-col gap-2">
                    <button
                      onClick={() =>
                        eventSettle(
                          event._id,
                          event.by,
                          request.amount,
                          request._id
                        )
                      }
                      className="p-2 cursor-pointer rounded-md bg-green-900/30 text-green-500"
                    >
                      Paid
                    </button>{" "}
                    <button
                      onClick={() =>
                        rejectSettle(
                          event._id,
                          event.by,
                          request.amount,
                          request._id
                        )
                      }
                      className="p-2 cursor-pointer rounded-md bg-red-900/30 text-red-500"
                    >
                      Reject
                    </button>{" "}
                  </div>
                ) : (
                  request.status
                )}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default Events;
