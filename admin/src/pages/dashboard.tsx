import Nav from "@/components/nav";
import PostEvent from "@/components/postevent";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import api from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import Footer from "@/components/footer";

const Dashboard = () => {
  const [postevent, setpostevent] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchAdmin = async () => {
    try {
      const res = await api.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/adminAuth/fetchAdmin`
      );
      return res?.data?.isAdmin;
    } catch (err: any) {
      toast.error(err.response?.data?.message);
      navigate("/");
      return;
    }
  };

  const { data: admin, isLoading } = useQuery({
    queryKey: ["admin"],
    queryFn: fetchAdmin,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading || !admin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white">
        <div className="flex flex-row gap-2">
          <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce"></div>
          <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-.3s]"></div>
          <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-.5s]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen flex flex-col  items-center">
      <Toaster position="top-center" />
      <Nav />

      <div className="w-full lg:w-[70%] p-2">
        <Outlet context={{ setpostevent, admin }} />

        <Footer />
      </div>

      {postevent && (
        <>
          <div
            onClick={() => setpostevent(false)}
            className="fixed inset-0 bg-black/5 backdrop-blur-sm"
          />
          <PostEvent setpostevent={setpostevent} admin={admin} />
        </>
      )}

      {isLoading && (
        <div className="inset-0 fixed z-40 bg-[rgba(21,21,21)] flex items-center justify-center">
          <div className="flex flex-row gap-2">
            <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-.5s]"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
