import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Register = () => {
  const [email, setemail] = useState<string>("");
  const [name, setname] = useState<string>("");
  const [phone, setphone] = useState<string>("");
  const [otp, setotp] = useState<string>("");
  const [gettingOTP, setgettingOTP] = useState<boolean>(false);
  const [loading, setloading] = useState<boolean>(false);
  const [isGetOTP, setisGetOTP] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleGetOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setgettingOTP(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/adminAuth/OTP`,
        {
          email,
        }
      );
      toast.success(res.data.message);
      setisGetOTP(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    } finally {
      setgettingOTP(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setloading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/adminAuth/register`,
        {
          name,
          email,
          phone,
          otp,
        }
      );
      setname("");
      setemail("");
      setphone("");
      setotp("");
      toast.success(res.data.message);
      navigate("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    } finally {
      setloading(false);
    }
  };

  const FormSubmit = isGetOTP ? handleSubmit : handleGetOTP;

  return (
    <div
      style={{
        background:
          "linear-gradient(rgba(22, 31, 243, 0.2) 0%, rgba(18, 139, 251, 0.1) 25%, rgba(0, 140, 115, 0) 50%)",
      }}
      className="w-screen h-screen flex items-center justify-center"
    >
      <Toaster position="top-center" />

      <div className="w-[100%] items-center flex absolute top-3 pl-3 gap-2">
        <div className="shape bg-[rgba(255,255,255,0.5)] w-10"></div>
        <p className="text-[rgba(255,255,255,0.5)] text-lg font-medium">
          myPass
        </p>
      </div>

      <form
        onSubmit={FormSubmit}
        className="w-[90%] bg-[rgba(255,255,255,0.1)] shadow-sm sm:w-[60%] md:w-[40%] lg:w-[30%] h-auto rounded-md p-[1rem] flex flex-col gap-3"
      >
        <p className="text-[rgba(255,255,255,0.8)] text-lg font-medium non-italic">
          Enter details to register
        </p>
        <input
          type="text"
          placeholder="Name"
          className="w-full border-1 border-[rgba(255,255,255,0.3)] rounded-md h-9 text-[rgba(255,255,255,0.8)] outline-none pt-2 pb-2 pl-2"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setname(e.target.value)
          }
          value={name}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border-1 border-[rgba(255,255,255,0.3)] rounded-md h-9 text-[rgba(255,255,255,0.8)] outline-none pt-2 pb-2 pl-2"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setemail(e.target.value)
          }
          value={email}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full border-1 border-[rgba(255,255,255,0.3)] rounded-md h-9 text-[rgba(255,255,255,0.8)] outline-none pt-2 pb-2 pl-2"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setphone(e.target.value)
          }
          value={phone}
          required
        />
        {isGetOTP ? (
          <div className="flex flex-col gap-1 items-center">
            <p className="text-[rgba(255,255,255,0.8)] text-lg font-light non-italic self-start flex gap-2 items-center">
              Enter OTP{" "}
              <span className="text-[rgba(255,255,255,0.5)] text-sm font-light italic">
                Sent to your Email Id
              </span>
            </p>
            <InputOTP
              value={otp}
              onChange={(val) => setotp(val)}
              maxLength={4}
              required
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        ) : (
          ""
        )}

        <p
          className="text-[rgba(255,255,255,0.5)] ml-auto text-sm font-light cursor-pointer"
          onClick={() => navigate("/")}
        >
          Already a user? LogIn
        </p>

        {isGetOTP ? (
          <button
            type="submit"
            disabled={loading}
            className="bg-[rgba(255,255,255,0.2)] flex items-center justify-center text-[rgba(255,255,255,0.8)] p-1 rounded-md font-medium outline-none cursor-pointer mt-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-white animate-spin fill-black"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="white"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              "Register"
            )}
          </button>
        ) : (
          <button
            type="submit"
            className="bg-[rgba(255,255,255,0.2)] flex items-center justify-center text-[rgba(255,255,255,0.8)] p-1 rounded-md font-medium outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none"
            disabled={gettingOTP}
          >
            {gettingOTP ? (
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-white animate-spin fill-black"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="white"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              "Get OTP"
            )}
          </button>
        )}
      </form>
    </div>
  );
};

export default Register;
