import { useState } from "react";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { TriangleAlert, ChevronDown, ChevronUp, CornerDownRight, Wallet, Plus, X, ArrowDownToLine } from "lucide-react";

type OutletContextType = {
  admin: { _id: string };
};

const statusColor: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-950/40 border-yellow-700/25",
  approved: "text-green-400 bg-green-950/40 border-green-700/25",
  rejected: "text-red-400 bg-red-950/40 border-red-700/25",
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

  const refreshFetch = () => queryClient.invalidateQueries({ queryKey: ["paymentDetail"] });
  const refreshEvents = () => queryClient.invalidateQueries({ queryKey: ["paymentEvents"] });

  const withdrawReq = async (eventName: string, amount: number, eventId: string) => {
    try {
      setWithdrawingEvent(eventId);
      const res = await api.post(`${import.meta.env.VITE_BACKEND_URL}/api/eventRoute/withdrawReq`, {
        adminid: admin._id,
        eventname: eventName,
        amount,
        eventid: eventId,
        status: "pending",
      });
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
      const res = await api.post(`${import.meta.env.VITE_BACKEND_URL}/api/eventRoute/deleteUpi`, { adminid: adminId });
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
      const res = await api.post(`${import.meta.env.VITE_BACKEND_URL}/api/eventRoute/addUpi`, { adminid: adminId, upiid });
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
    const res = await api.post(`${import.meta.env.VITE_BACKEND_URL}/api/eventRoute/getPaymentDetails`, { adminid: adminId });
    return res?.data;
  };

  const getEvents = async () => {
    const res = await api.post(`${import.meta.env.VITE_BACKEND_URL}/api/eventRoute/fetchpaymentEvents`, { adminId });
    return res?.data;
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
    <div className="w-full min-h-screen p-4 lg:p-5 flex flex-col gap-5">
      {/* UPI / Account Section */}
      <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 border-b border-white/[0.07]">
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Payout Account</p>
          {isLoading ? (
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          ) : null}
        </div>

        <div className="px-4 py-4">
          {isLoading ? null : paymentDetail?.upi === "" ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TriangleAlert size="0.9rem" className="text-yellow-400" />
                <p className="text-white/50 text-sm">No UPI ID added</p>
              </div>
              <button
                onClick={() => setaddupi(true)}
                className="flex items-center gap-1.5 bg-white/[0.07] hover:bg-white/10 border border-white/10 text-white/70 text-sm px-3 py-1.5 rounded-full transition-all cursor-pointer"
              >
                <Plus size="0.8rem" /> Add UPI
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet size="0.9rem" className="text-white/30" />
                <p className="text-white/70 text-sm font-medium">{paymentDetail?.upi}</p>
              </div>
              <button
                onClick={deleteUpi}
                disabled={deleting}
                className="text-red-400/70 hover:text-red-400 text-xs transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
              >
                {deleting ? "Removing..." : "Remove"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5 flex justify-between items-center">
        <div>
          <p className="text-white/35 text-xs mb-1">Total withdrawable</p>
          <p className="text-white/85 text-2xl font-semibold">₹{totalWithdrawableAmount ?? 0}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-green-950/40 border border-green-700/20 flex items-center justify-center">
          <ArrowDownToLine size="1rem" className="text-green-400" />
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/[0.07]">
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Events</p>
        </div>

        {events && events.length > 0 ? (
          <div className="divide-y divide-white/[0.05]">
            {events.map((event: any, index: number) => (
              <div key={`${event._id}-${index}`}>
                <div className="px-4 py-3 flex items-center justify-between hover:bg-white/[0.03] transition-all">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => setexpandHistory(expandHistory === event._id ? "" : event._id)}
                      className="text-white/30 hover:text-white/60 transition-colors cursor-pointer shrink-0"
                    >
                      {expandHistory === event._id ? <ChevronUp size="0.85rem" /> : <ChevronDown size="0.85rem" />}
                    </button>
                    <p className="text-white/80 text-sm truncate">{event.name}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <p className="text-white/70 text-sm font-medium">₹{event.totalWithdrawableAmount}</p>
                    {event.totalWithdrawableAmount > 0 && (
                      <button
                        onClick={() =>
                          paymentDetail?.upi === ""
                            ? setaddupi(true)
                            : withdrawReq(event.name, event.totalWithdrawableAmount, event._id)
                        }
                        disabled={!!withdrawingEvent}
                        className="flex items-center gap-1.5 bg-green-950/60 border border-green-700/25 text-green-400 text-xs px-3 py-1.5 rounded-full cursor-pointer hover:bg-green-950/80 transition-all disabled:opacity-40 disabled:pointer-events-none"
                      >
                        {withdrawingEvent === event._id ? (
                          <div className="w-3 h-3 border border-green-400/30 border-t-green-400 rounded-full animate-spin" />
                        ) : (
                          <ArrowDownToLine size="0.7rem" />
                        )}
                        {withdrawingEvent === event._id ? "Sending..." : "Withdraw"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded History */}
                {expandHistory === event._id && (
                  <div className="bg-black/20">
                    {paymentDetail?.paymentRequests
                      ?.filter((req: any) => req.eventId === event._id)
                      .slice()
                      .reverse()
                      .map((request: any, i: number) => (
                        <div key={i} className="px-4 py-2.5 flex items-center justify-between border-t border-white/[0.04]">
                          <div className="flex items-center gap-2">
                            <CornerDownRight size="0.75rem" className="text-white/25 shrink-0" />
                            <p className="text-white/45 text-xs">{request.eventName}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="text-white/55 text-xs">₹{request.amount}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${statusColor[request.status] ?? "text-white/40 bg-white/5 border-white/10"}`}>
                              {request.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    {!paymentDetail?.paymentRequests?.some((req: any) => req.eventId === event._id) && (
                      <div className="px-4 py-3 text-white/25 text-xs">No withdrawal history</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="px-4 py-8 text-center text-white/25 text-sm">No events yet</div>
        )}
      </div>

      {/* Add UPI Modal */}
      {addupi && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={addUpi}
            className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4 shadow-2xl"
          >
            <div className="flex justify-between items-center">
              <p className="text-white/85 font-semibold">Add UPI ID</p>
              <button
                type="button"
                onClick={() => setaddupi(false)}
                className="p-1.5 rounded-full bg-white/[0.06] hover:bg-white/10 border border-white/10 text-white/40 hover:text-white/70 transition-all cursor-pointer"
              >
                <X size="0.85rem" />
              </button>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-2">Your UPI ID</p>
              <input
                required
                type="text"
                placeholder="example@upi"
                value={upiid}
                onChange={(e) => setupiid(e.target.value)}
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2.5 text-white/80 text-sm outline-none placeholder:text-white/25 focus:border-white/20 transition-colors"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={adding}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white/80 text-sm font-medium rounded-xl cursor-pointer transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {adding ? (
                <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
              ) : (
                "Save UPI ID"
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Payments;
