import api from "@/utils/api";
import { useOutletContext } from "react-router-dom";
import EventCard from "./eventCard";
import { useState } from "react";
import { RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";
import EventPage from "./eventpage";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

type OutletContextType = {
  setpostevent: (value: boolean) => void;
  admin: {
    _id: string;
  };
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
        {
          adminId: adminId,
        }
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
    <div className="w-[100%] min-h-screen p-1 lg:p-3 lg:relative">
      {eventPage ? (
        <EventPage
          selectedevent={selectedevent}
          seteventPage={seteventPage}
          refreshFetch={refreshFetch}
        />
      ) : (
        <>
          {" "}
          <div className="w-[100%] flex justify-between">
            <h1 className="text-[rgba(255,255,255,0.8)] flex gap-3 font-semibold text-xl lg:text-2xl">
              Events{" "}
              <span
                onClick={refreshFetch}
                className="bg-[rgba(255,255,255,0.2)] p-1.5 rounded-md cursor-pointer flex h-[100%] gap-1 font-light text-sm items-center text-[rgba(255,255,255,0.8)] "
              >
                <RefreshCcw size={"1rem"} />
                refresh
              </span>
            </h1>{" "}
            <button
              onClick={() => setpostevent(true)}
              className="p-.5 pl-2.5 pr-2.5 text-sm font-medium text-[rgba(255,255,255,0.8)]  bg-[rgba(255,255,255,0.2)] rounded-sm flex gap-1 items-center lg:text-md cursor-pointer"
            >
              Post event
            </button>
          </div>
          <div className="w-[100%] p-3 flex flex-col items-center mt-4 sm:flex-row lg:flex-row flex-wrap lg:gap-5 rounded-md gap-3 shrink-0">
            {events && events.length > 0 ? (
              events.map((event: any, index: number) => (
                <EventCard
                  key={index}
                  event={event}
                  seteventPage={seteventPage}
                  setselectedevent={setselectedevent}
                />
              ))
            ) : isLoading ? (
              ""
            ) : (
              <div className="w-[100%] min-h-screen flex justify-center mt-50">
                <p className="text-3xl font-semibold text-[rgba(255,255,255,0.5)]">
                  No events posted
                </p>
              </div>
            )}

            {isLoading && (
              <div className="flex flex-row gap-2">
                <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-.5s]"></div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
