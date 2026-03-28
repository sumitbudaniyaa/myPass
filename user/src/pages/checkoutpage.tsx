import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";
import { CreditCard, Phone, Tag, Ticket } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckOutPage = () => {
  const [user, setuser] = useState<any>(null);
  const location = useLocation();
  const booking = location.state;
  const [loading, setloading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [proceeding, setproceeding] = useState<boolean>(false);
  const [cancelling, setcancelling] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>("");

  const subTotal = booking?.totalPrice;

  const tax = (amount: number) => {
    const ten = (10 / 100) * amount;
    return parseFloat((ten < 25 ? ten : 25).toFixed(2));
  };

  const calculatedTax = tax(subTotal);
  const grandTotal = subTotal + calculatedTax;

  const fetchUserDetail = async () => {
    try {
      const res = await api.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/fetchUserDetail`);
      setuser(res.data);
    } catch (err: any) {
      toast.error(err);
    }
  };

  useEffect(() => { fetchUserDetail(); }, [booking]);

  const createOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length !== 10) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }
    try {
      setproceeding(true);
      const res = await api.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/RZPcreateOrder`, {
        amount: grandTotal,
        bookingId: booking._id,
      });
      setproceeding(false);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: res.data.amount,
        currency: "INR",
        name: "myPass",
        order_id: res.data.id,
        handler: async function (response: any) {
          setloading(true);
          const verifyRes = await api.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/verifyPayment`, {
            eventId: booking?.eventid,
            bookingId: booking?._id,
            userEmail: user?.email,
            userName: user?.name,
            userPhone: phone,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          setloading(false);
          navigate("/booking-confirmation", { state: verifyRes.data });
        },
        prefill: { name: user?.name, email: user?.email, phone },
        theme: { color: "#3399cc" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
      rzp.on("payment.failed", () => {
        setloading(false);
        toast.error("Payment failed or cancelled");
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    }
  };

  const handleCancel = async () => {
    try {
      setcancelling(true);
      const res = await api.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/cancelBooking`, { bookingId: booking?._id });
      toast.success(res?.data?.message);
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    } finally {
      setcancelling(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />

      {loading && (
        <div className="pointer-events-none fixed inset-0 backdrop-blur-lg z-60 flex flex-col items-center justify-center bg-black/60 gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />
          <p className="text-white/55 text-sm">Confirming payment...</p>
        </div>
      )}

      {/* Nav */}
      <div className="w-screen h-[7vh] sticky top-0 flex px-3 items-center gap-2 backdrop-blur-lg border-b border-white/[0.06] z-50">
        <img onClick={() => navigate("/")} src="/mypasslogo.png" className="w-6 h-6 object-contain cursor-pointer" alt="myPass" />
        <p className="text-white/35 text-sm">Checkout</p>
        <button
          onClick={handleCancel}
          disabled={cancelling}
          className="ml-auto bg-red-950/60 hover:bg-red-900/70 border border-red-800/30 rounded-full px-3 py-1 text-red-300 text-xs transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
        >
          {cancelling ? "Cancelling..." : "Cancel"}
        </button>
      </div>

      <form onSubmit={createOrder} className="w-full sm:w-[70%] lg:w-[38%] mx-auto flex flex-col p-4 gap-3 pb-8">
        {/* Event info */}
        <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.07] rounded-2xl p-3">
          <img src={booking?.eventPoster} className="w-14 h-16 rounded-xl object-cover shrink-0" alt="" />
          <div>
            <p className="text-white/80 text-sm font-semibold">{booking?.eventName}</p>
            <p className="text-white/35 text-xs mt-0.5">{booking?.totalTickets} ticket{booking?.totalTickets !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06]">
            <Phone size="0.8rem" className="text-white/25" />
            <p className="text-white/35 text-xs font-medium uppercase tracking-wider">Contact</p>
          </div>
          <div className="px-4 py-3">
            <input
              onChange={(e) => setPhone(e.target.value)}
              required
              type="tel"
              maxLength={10}
              className="w-full bg-transparent text-white/80 text-sm outline-none placeholder:text-white/20"
              placeholder="10-digit phone number"
            />
          </div>
        </div>

        {/* Tickets */}
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06]">
            <Ticket size="0.8rem" className="text-white/25" />
            <p className="text-white/35 text-xs font-medium uppercase tracking-wider">Tickets</p>
          </div>
          <div className="px-4 py-3 flex flex-col gap-2">
            {booking?.tickets.map((ticket: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <p className="text-white/60 text-sm">{ticket?.ticketName}</p>
                <p className="text-white/60 text-sm">₹{ticket?.ticketPrice}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary + Pay */}
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06]">
            <Tag size="0.8rem" className="text-white/25" />
            <p className="text-white/35 text-xs font-medium uppercase tracking-wider">Summary</p>
          </div>
          <div className="px-4 py-3 flex flex-col gap-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-white/45">Subtotal</span>
              <span className="text-white/55">₹{subTotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/45">Convenience fee</span>
              <span className="text-white/55">₹{calculatedTax}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2.5 border-t border-white/[0.07] mt-0.5">
              <span className="text-white/80">Total</span>
              <span className="text-white/90">₹{grandTotal}</span>
            </div>
          </div>

          <div className="px-4 pb-4">
            <button
              type="submit"
              disabled={proceeding}
              className="w-full flex justify-center items-center gap-2 py-3 bg-green-900/70 hover:bg-green-800/80 border border-green-700/30 rounded-xl text-green-100 font-medium transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {proceeding ? (
                <div className="w-4 h-4 border-2 border-green-300/30 border-t-green-300 rounded-full animate-spin" />
              ) : (
                <>
                  <CreditCard size="1rem" />
                  Pay ₹{grandTotal}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CheckOutPage;
