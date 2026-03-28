import { useEffect, useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Mail, ArrowRight } from "lucide-react";

const Login = () => {
  const [isGetOTP, setisGetOTP] = useState<boolean>(false);
  const navigate = useNavigate();
  const [email, setemail] = useState<string>("");
  const [otp, setotp] = useState<string>("");
  const [sendingOTP, setsendingOTP] = useState<boolean>();
  const [loading, setloading] = useState<boolean>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard/events");
  });

  const handleGetOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setsendingOTP(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/adminAuth/OTP`,
        { email }
      );
      toast.success(res.data.message);
      setisGetOTP(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    } finally {
      setsendingOTP(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setloading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/adminAuth/login`,
        { email, otp }
      );
      toast.success(res.data.message);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard/events");
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    } finally {
      setloading(false);
    }
  };

  const FormSubmit = isGetOTP ? handleSubmit : handleGetOtp;

  return (
    <div
      style={{ background: "linear-gradient(rgba(22, 31, 243, 0.15) 0%, rgba(18, 139, 251, 0.07) 25%, rgba(0, 140, 115, 0) 50%)" }}
      className="w-screen h-screen flex flex-col items-center justify-center relative"
    >
      <Toaster position="top-center" />

      <div className="flex items-center gap-1.5 absolute top-4 left-4">
        <img src="/mypasslogo.png" className="w-7 h-7 object-contain" alt="myPass" />
        <p className="text-white/70 font-semibold">myPass</p>
      </div>

      <form
        onSubmit={FormSubmit}
        className="w-[90%] sm:w-[60%] md:w-[42%] lg:w-[32%] bg-white/[0.06] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 shadow-2xl"
      >
        <div>
          <p className="text-white/85 text-lg font-semibold">
            {isGetOTP ? "Enter your OTP" : "Log in to myPass"}
          </p>
          <p className="text-white/35 text-sm mt-0.5">
            {isGetOTP ? `Code sent to ${email}` : "Manage your events and bookings"}
          </p>
        </div>

        {!isGetOTP && (
          <div className="relative flex items-center">
            <Mail size="0.85rem" className="absolute left-3 text-white/30 pointer-events-none" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className="w-full pl-8 pr-3 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white/80 text-sm outline-none placeholder:text-white/25 focus:border-white/20 transition-colors"
              required
            />
          </div>
        )}

        {isGetOTP && (
          <div className="flex flex-col items-center gap-3">
            <InputOTP value={otp} onChange={(val) => setotp(val)} maxLength={4} required>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
            <p
              className="text-white/30 text-xs cursor-pointer hover:text-white/50 transition-colors"
              onClick={() => setisGetOTP(false)}
            >
              ← Change email
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={sendingOTP || loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white/80 text-sm font-medium rounded-xl cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {(sendingOTP || loading) ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
          ) : (
            <>
              {isGetOTP ? "Log In" : "Get OTP"}
              <ArrowRight size="0.85rem" />
            </>
          )}
        </button>

        <p
          className="text-white/30 text-xs text-center cursor-pointer hover:text-white/50 transition-colors"
          onClick={() => navigate("/register")}
        >
          Don't have an account? <span className="underline">Register</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
