import { useState } from "react";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { TriangleAlert } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { CornerDownRight } from "lucide-react";

type OutletContextType = {
  admin: {
    _id: string;
  };
};

const Payments = () => {
  const [addupi, setaddupi] = useState<boolean>(false);
  const [upiid, setupiid] = useState<string>("");
  const [adding, setadding] = useState<boolean>(false);
  const [deleting, setdeleting] = useState<boolean>(false);
  const { admin } = useOutletContext<OutletContextType>();
  const adminId = admin?._id;
  const [withdrawingEvent, setWithdrawingEvent] = useState<string>("");
  const queryClient = useQueryClient();
  const [expandHistory, setexpandHistory] = useState<string>("");

  const refreshFetch = () => {
    queryClient.invalidateQueries({ queryKey: ["paymentDetail"] });
  };

  const refreshEvents = () => {
    queryClient.invalidateQueries({ queryKey: ["paymentEvents"] });
  };

  const withdrawReq = async (
    eventName: string,
    amount: number,
    eventId: string
  ) => {
    try {
      setWithdrawingEvent(eventId);
      const res = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/eventRoute/withdrawReq`,
        {
          adminid: admin._id,
          eventname: eventName,
          amount: amount,
          eventid: eventId,
          status: "pending",
        }
      );

      toast.success(res.data.message);
      refreshFetch();
      refreshEvents();
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    } finally {
      setWithdrawingEvent("");
    }
  };

  const deleteUpi = async () => {
    try {
      setdeleting(true);
      const res = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/eventRoute/deleteUpi`,
        {
          adminid: adminId,
        }
      );

      toast.success(res.data.message);
      refreshFetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    } finally {
      setdeleting(false);
    }
  };

  const addUpi = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setadding(true);
      const res = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/eventRoute/addUpi`,
        {
          adminid: adminId,
          upiid,
        }
      );

      toast.success(res.data.message);
      refreshFetch();
      setupiid("");
      setaddupi(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    } finally {
      setadding(false);
    }
  };

  const getPaymentDetails = async () => {
    try {
      const res = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/eventRoute/getPaymentDetails`,
        {
          adminid: adminId,
        }
      );
      return res?.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    }
  };

  const getEvents = async () => {
    try {
      const res = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/eventRoute/fetchpaymentEvents`,
        {
          adminId: adminId,
        }
      );
      return res?.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    }
  };

  const { data: events } = useQuery({
    queryKey: ["paymentEvents", adminId],
    queryFn: getEvents,
    staleTime: 1000 * 60 * 5,
    enabled: !!adminId,
  });

  const { data: paymentDetail, isLoading } = useQuery({
    queryKey: ["paymentDetail", adminId],
    queryFn: getPaymentDetails,
    staleTime: 1000 * 60 * 5,
    enabled: !!adminId,
  });

  const totalWithdrawableAmount = events?.reduce(
    (sum: number, event: any) => sum + event.totalWithdrawableAmount,
    0
  );

  return (
    <div className="w-full min-h-screen flex flex-col p-3">
      <div className="w-[100%] flex items-center justify-between">
        <p className="text-[rgba(255,255,255,0.5)]">Account details</p>{" "}
        {isLoading ? (
          <div className="flex flex-row gap-2">
            <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-.5s]"></div>
          </div>
        ) : paymentDetail?.upi === "" ? (
          <div className="flex items-center gap-1">
            <TriangleAlert size={"1rem"} className="text-yellow-200" />
            <button
              onClick={() => setaddupi(true)}
              className="p-1 pl-2 pr-2 text-sm rounded-sm cursor-pointer bg-white/10 text-[rgba(255,255,255,0.8)]"
            >
              Add
            </button>
          </div>
        ) : (
          <p className="text-sm flex items-center gap-3 text-[rgba(255,255,255,0.5)]">
            {paymentDetail?.upi}{" "}
            <button
              onClick={deleteUpi}
              className={`text-xs cursor-pointer text-red-500/70 ${
                deleting ? "cursor-not-allowed pointer-events-none" : ""
              }`}
            >
              {deleting ? "removing..." : "remove"}
            </button>
          </p>
        )}
      </div>

      <div className="flex items-center bg-white/10 p-5 rounded-lg justify-between mt-5">
        <p className="text-xl w-[50%] text-[rgba(255,255,255,0.5)]">
          Total withdrawable amount
        </p>{" "}
        <p className="text-2xl font-semibold text-[rgba(255,255,255,0.8)]">
          ₹{totalWithdrawableAmount}
        </p>
      </div>

      <div className="w-full bg-[rgba(255,255,255,0.1)] rounded-md p-4 overflow-x-auto mt-5">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20 text-left">
              <th className="py-2 px-4 text-[rgba(255,255,255,0.5)] font-semibold">
                Event
              </th>
              <th className="py-2 px-4 text-[rgba(255,255,255,0.5)] font-semibold">
                Amount
              </th>
              <th className="py-2 px-4 text-[rgba(255,255,255,0.5)] font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {events?.map((event: any, index: number) => (
              <>
                <tr
                  key={`${event._id}-${index}`}
                  className="hover:bg-[rgba(21,21,21,0.1)] transition-all"
                >
                  <td className="py-2 px-4 text-[rgba(255,255,255,0.8)] flex items-center gap-2">
                    {expandHistory === event._id ? (
                      <ChevronUp
                        onClick={() => setexpandHistory("")}
                        size={"1rem"}
                        className="cursor-pointer"
                      />
                    ) : (
                      <ChevronDown
                        onClick={() => setexpandHistory(event._id)}
                        size={"1rem"}
                        className="cursor-pointer"
                      />
                    )}
                    {event.name}
                  </td>
                  <td className="py-2 px-4 text-[rgba(255,255,255,0.8)]">
                    ₹{event.totalWithdrawableAmount}
                  </td>

                  <td className="py-2 px-4 text-[rgba(255,255,255,0.8)]">
                    {event.totalWithdrawableAmount > 0 && (
                      <button
                        onClick={() => {
                          paymentDetail.upi === ""
                            ? setaddupi(true)
                            : withdrawReq(
                                event?.name,
                                event.totalWithdrawableAmount,
                                event._id
                              );
                        }}
                        className={`bg-green-900/50 p-1 pl-2 pr-2 text-sm rounded-md text-green-300 cursor-pointer ${
                          withdrawingEvent
                            ? "cursor-not-allowed pointer-events-none opacity-50"
                            : ""
                        }`}
                      >
                        {withdrawingEvent === event._id
                          ? "sending request..."
                          : "Withdraw"}
                      </button>
                    )}
                  </td>
                </tr>

                {expandHistory === event._id &&
                  paymentDetail?.paymentRequests
                    ?.filter((request: any) => request.eventId === event._id)
                    .reverse()
                    .map((request: any, index: number) => (
                      <tr key={`${event._id}-${index}`} className="bg-black/20">
                        <td className="py-2 px-4 text-[rgba(255,255,255,0.8)] flex items-center gap-1">
                          <CornerDownRight
                            size={"1rem"}
                            className="text-[rgba(255,255,255,0.5)]"
                          />
                          {request.eventName}
                        </td>
                        <td className="py-2 px-4 text-[rgba(255,255,255,0.8)]">
                          {request.amount}
                        </td>
                        <td className="py-2 px-4 text-[rgba(255,255,255,0.8)]">
                          {request.status}
                        </td>
                      </tr>
                    ))}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {addupi && (
        <div className="inset-0 fixed flex justify-center items-center backdrop-blur-sm z-20">
          {" "}
          <form
            onSubmit={(e) => addUpi(e)}
            className="p-3 bg-black/50 border border-[rgba(255,255,255,0.2)] rounded-lg flex flex-col gap-2"
          >
            {" "}
            <p className="w-full text-[rgba(255,255,255,0.8)]">UPI Id</p>{" "}
            <input
              type="text"
              placeholder="example@upi"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setupiid(e.target.value);
              }}
              className="w-full lg:min-w-80 p-2 border-1 outline-none pl-2 text-[rgba(255,255,255,0.8)] border-[rgba(255,255,255,0.2)] rounded-md"
            />{" "}
            <button
              disabled={adding}
              type="submit"
              className={`bg-white cursor-pointer rounded-md text-sm p-1 pl-2 pr-2 mt-3 ${
                adding
                  ? "cursor-not-allowed pointer-events-none opacity-50"
                  : ""
              }`}
            >
              {adding ? "adding..." : "Add"}
            </button>{" "}
            <button
              onClick={() => setaddupi(false)}
              className="bg-red-900/50 roudned-sm cursor-pointer p-1 pl-2 pr-2 text-sm text-red-300 rounded-md"
            >
              Cancel
            </button>{" "}
          </form>{" "}
        </div>
      )}
    </div>
  );
};

export default Payments;
