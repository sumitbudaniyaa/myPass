import { useEffect, useState } from "react";
import EventCard from "./eventcard";
import axios from "axios";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

type EventSectionProp = {
  selectedCategory: string;
  searchText: string;
};

const EventSection = ({ selectedCategory, searchText }: EventSectionProp) => {
  const [filteredEvents, setfilteredEvents] = useState<any[]>([]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/fetchEvents`
      );
      return res?.data?.events;
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    }
  };

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    staleTime: 1000 * 60 * 5,
  });

  let tempEvents = [...events];

  useEffect(() => {
    if (selectedCategory !== "all") {
      tempEvents = tempEvents?.filter(
        (event: any) => (event?.category).toLowerCase() === selectedCategory
      );
    }

    if (searchText.trim() !== "") {
      tempEvents = tempEvents?.filter((event: any) =>
        (event?.name).toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setfilteredEvents(tempEvents);
  }, [events, selectedCategory, searchText]);

  return (
    <div className="pl-2 pr-2 flex flex-wrap w-[100%] lg:w-[70%] min-h-screen lg:self-center justify-center sm:justify-start gap-3 mt-5 ">
      {isLoading ? (
        <div className="flex flex-row gap-2">
          <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce"></div>
          <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-.3s]"></div>
          <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-.5s]"></div>
        </div>
      ) : filteredEvents?.length !== 0 ? (
        filteredEvents?.map((event: any, index: any) => (
          <EventCard key={index} event={event} />
        ))
      ) : (
        <div className="w-[100%] h-100 flex justify-center items-center p-5">
          <h1 className="w-[100%] text-bold flex justify-center text-[rgba(255,255,255,0.4)] text-center">
            Sorry, there are no events posted. Please come back later
          </h1>
        </div>
      )}
    </div>
  );
};

export default EventSection;
