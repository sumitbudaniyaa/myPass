import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";
import { CreditCard } from "lucide-react";

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

  const tax = (subTotal: any) => {
    let amount = subTotal;
    var tax;

    let tenpercentamount = (10 / 100) * amount;

    if (tenpercentamount < 25) {
      tax = tenpercentamount;
    } else {
      tax = 25;
    }
    return parseFloat(tax.toFixed(2));
  };

  const calculatedTax = tax(subTotal);
  const grandTotal = subTotal + calculatedTax;

  const fetchEventDetail = async () => {
    try {
      const res = await api.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/fetchUserDetail`
      );

      setuser(res.data);
    } catch (err: any) {
      toast.error(err);
    }
  };

  useEffect(() => {
    fetchEventDetail();
  }, [booking]);

  const createOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone || phone.length !== 10) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }

    try {
      setproceeding(true);
      const res = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/RZPcreateOrder`,
        {
          amount: subTotal + tax(subTotal),
          bookingId: booking._id,
        }
      );

      setproceeding(false);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: res.data.amount,
        currency: "INR",
        name: "myPass",
        order_id: res.data.id,
        handler: async function (response: any) {
          setloading(true);
          const verifyRes = await api.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/user/verifyPayment`,
            {
              eventId: booking?.eventid,
              bookingId: booking?._id,
              userEmail: user?.email,
              userName: user?.name,
              userPhone: phone,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }
          );

          setloading(false);
          navigate("/booking-confirmation", { state: verifyRes.data });
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          phone: phone,
        },
        theme: {
          color: "#3399cc",
        },
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
      const res = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/cancelBooking`,
        {
          bookingId: booking?._id,
        }
      );

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
        <div className="pointer-events-none fixed inset-0 backdrop-blur-lg z-60 flex items-center justify-center bg-black/50 p-5 gap-2">
          <p className="text-white text-sm">confirming payment</p>
          <div
            className="loader rounded-full bg-black animate-spin
aspect-square w-6 flex justify-center items-center text-white"
          >
            ₹
          </div>
        </div>
      )}
      <div className="w-screen h-[7vh] sticky top-0 flex pl-3 pr-2 items-center gap-2 backdrop-blur-lg">
        {" "}
        <div
          onClick={() => navigate("/")}
          className="shape bg-[rgba(255,255,255,0.5)] w-7"
        ></div>
        <button
          onClick={handleCancel}
          className={`cursor-pointer ml-auto bg-red-900 rounded-md p-1 pl-2 pr-2 text-red-200 text-xs lg:text-sm ${
            cancelling
              ? "opacity-50 pointer-events-none cursor-not-allowed"
              : ""
          }`}
        >
          {cancelling ? "cancelling..." : "Cancel"}
        </button>
      </div>

      <form
        onSubmit={createOrder}
        className="w-screen min-h-screen sm:w-[70%] lg:w-[40%] ml-[50%] translate-x-[-50%] flex flex-col p-2"
      >
        <div className="mt-5 bg-[rgba(255,255,255,0.1)] w-[100%] rounded-lg p-2 lg:p-4">
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPhone(e.target.value);
            }}
            required
            type="tel"
            className="w-[100%] flex justify-between text-[rgba(255,255,255,0.8)] outline-none"
            placeholder="Enter phone number"
          />
        </div>

        <div className="mt-1 bg-[rgba(255,255,255,0.1)] w-[100%] rounded-lg p-2 lg:p-4">
          {booking?.tickets.map((ticket: any, index: any) => (
            <div key={index} className="w-[100%] flex justify-between">
              {" "}
              <p className="text-[rgba(255,255,255,0.5)]">
                {ticket?.ticketName}
              </p>
              <p className="text-[rgba(255,255,255,0.5)]">
                ₹ {ticket?.ticketPrice}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-1 bg-[rgba(255,255,255,0.1)] w-[100%] rounded-lg p-2 lg:p-4">
          <p className="w-[100%] flex justify-between text-[rgba(255,255,255,0.5)] lg:text-lg">
            Sub Total <span>₹ {subTotal}</span>
          </p>
          <p className="w-[100%] flex justify-between text-[rgba(255,255,255,0.5)] lg:text-lg">
            Convenience fee <span>₹ {calculatedTax}</span>
          </p>
          <p className="w-[100%] flex justify-between text-xl text-[rgba(255,255,255,0.8)] lg:text-2xl pt-2 font-semibold mt-5 border-t-1 border-[rgba(255,255,255,0.2)]">
            Grand Total<span>₹ {grandTotal}</span>
          </p>

          <button
            type="submit"
            disabled={proceeding}
            className={`cursor-pointer w-[100%] flex justify-center items-center gap-1 p-2 bg-green-800 rounded-lg mt-5 text-green-200 text-lg ${
              proceeding
                ? "cursor-not-allowed pointer-events-none opacity-50"
                : ""
            }`}
          >
            {proceeding ? (
              "processing payment..."
            ) : (
              <>
                Proceed to Pay <CreditCard size={"1.2rem"} />
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default CheckOutPage;
