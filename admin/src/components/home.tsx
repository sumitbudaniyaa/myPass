import api from "@/utils/api";
import { useOutletContext } from "react-router-dom";
import EventCard from "./eventCard";
import { useState } from "react";
import { RefreshCcw, Plus } from "lucide-react";
import toast from "react-hot-toast";
import EventPage from "./eventpage";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type OutletContextType = {
  setpostevent: (value: boolean) => void;
  admin: { _id: string };
};

const Home = () => {
  const { setpostevent, admin } = useOutletContext<OutletContextType>();
  const adminId = admin?._id;
  const [eventPage, seteventPage] = useState<boolean>(false);
  const [selectedevent, setselectedevent] = useState<any>(null);
  const queryClient = useQueryClient();

  const refreshFetch = () => {
    queryClient.invalidateQueries({ queryKey: ["events"] });
  };

  const fetchEvents = async () => {
    try {
      const res = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/eventRoute/fetchEvent`,
        { adminId }
      );
      return res?.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message);
      return;
    }
  };

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events", adminId],
    queryFn: fetchEvents,
    staleTime: 1000 * 60 * 5,
    enabled: !!adminId,
  });

  return (
    <div className="w-full min-h-screen p-4 lg:p-5">
      {eventPage ? (
        <EventPage
          selectedevent={selectedevent}
          seteventPage={seteventPage}
          refreshFetch={refreshFetch}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-3">
              <h1 className="text-white/85 font-semibold text-xl">Events</h1>
              <button
                onClick={refreshFetch}
                className="flex items-center gap-1.5 bg-white/[0.06] hover:bg-white/10 border border-white/10 px-2.5 py-1.5 rounded-full text-white/40 hover:text-white/70 text-xs transition-all cursor-pointer"
              >
                <RefreshCcw size="0.75rem" />
                Refresh
              </button>
            </div>
            <button
              onClick={() => setpostevent(true)}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 border border-white/10 px-3 py-1.5 rounded-full text-white/80 text-sm font-medium transition-all cursor-pointer"
            >
              <Plus size="0.9rem" />
              Post event
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center mt-20">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-.5s]"></div>
              </div>
            </div>
          ) : events && events.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {events.map((event: any, index: number) => (
                <EventCard
                  key={index}
                  event={event}
                  seteventPage={seteventPage}
                  setselectedevent={setselectedevent}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-32 gap-3">
              <p className="text-white/20 text-4xl">🎪</p>
              <p className="text-white/35 font-medium">No events posted yet</p>
              <button
                onClick={() => setpostevent(true)}
                className="flex items-center gap-1.5 bg-white/[0.07] hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-white/50 text-sm transition-all cursor-pointer mt-1"
              >
                <Plus size="0.85rem" />
                Create your first event
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
