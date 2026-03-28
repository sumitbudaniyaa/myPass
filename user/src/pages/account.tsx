import { ChevronLeft, Mail, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const Account = () => {
  const navigate = useNavigate();
  const [confirmdelete, setconfirmdelete] = useState<boolean>(false);

  const fetchAccount = async () => {
    try {
      const res = await api.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/fetchAccount`);
      return res?.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    }
  };

  const deleteAccount = async () => {
    try {
      const res = await api.delete(`${import.meta.env.VITE_BACKEND_URL}/api/user/deleteAccount`);
      localStorage.removeItem("token");
      toast.success(res.data.message);
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    }
  };

  const { data: account, isLoading } = useQuery({
    queryKey: ["account"],
    queryFn: fetchAccount,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <>
      <div className="w-screen h-[7vh] sticky top-0 flex px-3 items-center gap-2 backdrop-blur-lg border-b border-white/[0.06] z-50">
        <button onClick={() => navigate("/")} className="text-white/40 hover:text-white/70 transition-colors cursor-pointer">
          <ChevronLeft size="1.2rem" />
        </button>
        <p className="text-white/60 text-sm font-medium">Account</p>
        <img onClick={() => navigate("/")} src="/mypasslogo.png" className="w-6 h-6 object-contain ml-auto cursor-pointer" alt="myPass" />
      </div>

      <div className="w-full sm:w-[70%] lg:w-[40%] mx-auto min-h-screen flex flex-col p-5 pb-8">
        {isLoading ? (
          <div className="flex justify-center mt-20">
            <div className="flex gap-2">
              {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
            </div>
          </div>
        ) : (
          <>
            {/* Avatar + name */}
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="w-20 h-20 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center overflow-hidden">
                <img src="usericon.png" alt="" className="w-full h-full object-cover opacity-60" />
              </div>
              <div className="text-center">
                <p className="text-white/85 text-xl font-semibold">{account?.name}</p>
                <p className="text-white/35 text-sm mt-0.5">{account?.email}</p>
              </div>
            </div>

            {/* Info cards */}
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl overflow-hidden divide-y divide-white/[0.06]">
              <div className="flex items-center gap-3 px-4 py-3.5">
                <User size="0.9rem" className="text-white/25 shrink-0" />
                <div>
                  <p className="text-white/30 text-xs">Full Name</p>
                  <p className="text-white/75 text-sm mt-0.5">{account?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3.5">
                <Mail size="0.9rem" className="text-white/25 shrink-0" />
                <div>
                  <p className="text-white/30 text-xs">Email Address</p>
                  <p className="text-white/75 text-sm mt-0.5">{account?.email}</p>
                </div>
              </div>
            </div>

            {/* Danger zone */}
            <div className="mt-6 bg-red-950/20 border border-red-900/25 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <p className="text-white/60 text-sm font-medium">Delete Account</p>
                <p className="text-white/25 text-xs mt-0.5">Removes all data permanently</p>
              </div>
              <button
                onClick={() => setconfirmdelete(true)}
                className="bg-red-950/60 border border-red-700/30 text-red-400 rounded-full px-4 py-1.5 text-sm cursor-pointer hover:bg-red-950/80 transition-all"
              >
                Delete
              </button>
            </div>
          </>
        )}

        {/* Confirm delete modal */}
        {confirmdelete && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4 shadow-2xl">
              <div>
                <p className="text-white/85 font-semibold">Delete account?</p>
                <p className="text-white/40 text-sm mt-1">This will permanently delete your account, bookings, and all data.</p>
              </div>
              <button
                onClick={deleteAccount}
                className="w-full bg-red-950/60 border border-red-700/30 text-red-400 py-2.5 rounded-xl text-sm font-medium cursor-pointer hover:bg-red-950/80 transition-all"
              >
                Yes, delete my account
              </button>
              <button
                onClick={() => setconfirmdelete(false)}
                className="w-full bg-white/[0.06] border border-white/10 text-white/60 py-2.5 rounded-xl text-sm cursor-pointer hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Account;
