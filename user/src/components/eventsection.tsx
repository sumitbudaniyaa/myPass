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
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/fetchEvents`);
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
        (event: any) => event?.category?.toLowerCase() === selectedCategory
      );
    }
    if (searchText.trim() !== "") {
      tempEvents = tempEvents?.filter((event: any) =>
        event?.name?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    setfilteredEvents(tempEvents);
  }, [events, selectedCategory, searchText]);

  return (
    <div className="px-3 w-full lg:w-[70%] lg:self-center mt-5 pb-6">
      {isLoading ? (
        <div className="flex justify-center mt-16">
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-white/20 animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-white/20 animate-bounce [animation-delay:-.3s]" />
            <div className="w-2 h-2 rounded-full bg-white/20 animate-bounce [animation-delay:-.5s]" />
          </div>
        </div>
      ) : filteredEvents.length !== 0 ? (
        <div className="flex flex-wrap gap-3 justify-start">
          {filteredEvents.map((event: any, index: number) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-24 gap-3">
          <p className="text-white/20 text-4xl">🎪</p>
          <p className="text-white/35 text-sm font-medium">
            {searchText.trim() !== ""
              ? `No events found for "${searchText}"`
              : selectedCategory !== "all"
              ? `No ${selectedCategory} events right now`
              : "No events yet — check back soon"}
          </p>
        </div>
      )}
    </div>
  );
};

export default EventSection;
