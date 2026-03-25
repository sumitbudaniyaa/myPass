import { LogOut } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Logged Out successfully");
    localStorage.removeItem("token");
    navigate("/");
  };

  const fetchEvents = async () => {
    try {
      const res = await api.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/scannerRoute/fetchEvents`
      );
      return res?.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message);
      return [];
    }
  };

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="w-screen min-h-screen flex flex-col">
      <Toaster position="top-center" />
      <div className="w-screen h-[7vh] flex items-center sticky top-0 backdrop-blur-lg pl-2 p-1 pr-2 gap-3 z-50">
        <div className="flex items-center gap-1">
          <div className="shape bg-[rgba(255,255,255,0.5)] w-6"></div>
          <p className="text-[rgba(255,255,255,0.5)]">myPass</p>
        </div>

        <div
          onClick={handleLogout}
          className="p-1.5 ml-auto cursor-pointer bg-red-500/30  rounded-md flex justify-center items-center gap-1"
        >
          <p className="hidden lg:block text-sm text-[rgba(255,255,255,0.8)]">
            LogOut
          </p>{" "}
          <LogOut size={"1.1rem"} className="text-[rgba(255,255,255,0.8)]" />
        </div>
      </div>

      {isLoading ? (
        <div className="inset-0 fixed z-40 bg-[rgba(21,21,21)] flex items-center justify-center">
          <div className="flex flex-row gap-2">
            <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-.5s]"></div>
          </div>
        </div>
      ) : (
        <div className="w-[100%] h-50 p-3 flex flex-col gap-2">
          <p className="text-[rgba(255,255,255,0.5)] text-xl">Events</p>

          {events.map((event: any, index: number) => (
            <div
              onClick={() => navigate(`/scan/${event?.name}/${event?._id}`)}
              key={index}
              className="bg-white/10 w-full rounded-md p-3 flex flex-col gap-1"
            >
              <p className="text-[rgba(255,255,255,0.5)] text-xl">
                {event?.name}
              </p>{" "}
              <p className="text-[rgba(255,255,255,0.5)]">{event?.venue}</p>
            </div>
          ))}

          {}
        </div>
      )}
    </div>
  );
};

export default Home;
