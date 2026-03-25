import { useNavigate } from "react-router-dom";

type EventCard = {
  event: any;
};

const EventCard = ({ event }: EventCard) => {
  const navigate = useNavigate();

  const totaltickets = event.tickets.reduce(
    (sum: any, t: any) => sum + t.totalTickets,
    0
  );

  const bookedtickets = event.tickets.reduce(
    (sum: any, t: any) => sum + t.bookedTickets,
    0
  );

  const isSoldOut = totaltickets === bookedtickets;

  return (
    <div
      onClick={() => navigate(`/${event._id}`)}
      className={` ${
        isSoldOut ? "pointer-events-none opacity-50" : ""
      } relative w-40 h-67 lg:w-50 lg:h-70 border-1 border-[rgba(255,255,255,0.2)] rounded-md justify-between flex flex-col p-1.5 hover:scale-103 duration-200 cursor-pointer`}
    >
      {isSoldOut ? (
        <div className="w-[100%] h-10 bg-red-900/80 absolute top-0 left-0 flex items-center rounded-md justify-center text-[rgba(255,255,255,0.8)] font-semibold">
          Sold Out
        </div>
      ) : (
        ""
      )}
      <img src={event.poster} className="h-[90%] rounded-sm" alt="" />
      <p className="text-sm font-md text-[rgba(255,255,255,0.8)] mt-1 pl-1">
        {event.name}
      </p>
    </div>
  );
};

export default EventCard;
