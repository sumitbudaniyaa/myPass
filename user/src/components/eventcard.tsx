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

  const minPrice = Math.min(...event.tickets.map((t: any) => t.price));

  return (
    <div
      onClick={() => navigate(`/${event._id}`)}
      className={`relative w-44 h-72 lg:w-52 lg:h-80 rounded-xl overflow-hidden border border-white/10 cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-black/60 hover:border-white/20 ${
        isSoldOut ? "pointer-events-none opacity-40" : ""
      }`}
    >
      <img
        src={event.poster}
        className="w-full h-full object-cover"
        alt={event.name}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

      {isSoldOut && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-red-900/90 text-red-200 text-xs font-semibold px-3 py-1 rounded-full border border-red-700/50">
            Sold Out
          </span>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-2.5">
        <p className="text-white/95 text-sm font-medium leading-tight truncate">
          {event.name}
        </p>
        {!isSoldOut && (
          <p className="text-white/50 text-xs mt-0.5">from ₹{minPrice}</p>
        )}
      </div>
    </div>
  );
};

export default EventCard;
