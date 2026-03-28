import { formatTo12Hour } from "@/utils/formattime";
import { Calendar, Clock, MapPin } from "lucide-react";

type EventCardProps = {
  event: any;
  seteventPage: (value: boolean) => void;
  setselectedevent: any;
};

const EventCard = ({ event, seteventPage, setselectedevent }: EventCardProps) => {
  const soldTickets = event.tickets?.reduce(
    (sold: number, ticket: any) => sold + (ticket.bookedTickets || 0), 0
  );
  const totalTickets = event.tickets?.reduce(
    (total: number, ticket: any) => total + (ticket.totalTickets || 0), 0
  );
  const soldPercent = totalTickets > 0 ? Math.round((soldTickets / totalTickets) * 100) : 0;

  return (
    <div
      onClick={() => { seteventPage(true); setselectedevent(event); }}
      className="w-full sm:w-[47%] lg:w-[31%] bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 hover:border-white/15 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 shrink-0"
    >
      <div className="relative">
        <img
          src={event.poster}
          alt={event.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <span className={`absolute top-2.5 right-2.5 text-xs px-2.5 py-1 rounded-full font-medium border ${
          event.status === "upcoming"
            ? "bg-green-950/80 text-green-400 border-green-700/30"
            : "bg-red-950/80 text-red-400 border-red-700/30"
        }`}>
          {event.status}
        </span>
      </div>

      <div className="p-3 flex flex-col gap-2">
        <p className="text-white/90 font-semibold text-base truncate">{event.name}</p>

        <div className="flex flex-col gap-1">
          <p className="flex items-center gap-1.5 text-white/45 text-xs">
            <MapPin size="0.75rem" className="shrink-0" />
            {event.venue}
          </p>
          <p className="flex items-center gap-1.5 text-white/45 text-xs">
            <Calendar size="0.75rem" className="shrink-0" />
            {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </p>
          <p className="flex items-center gap-1.5 text-white/45 text-xs">
            <Clock size="0.75rem" className="shrink-0" />
            {formatTo12Hour(event.time)}
          </p>
        </div>

        <div className="pt-1 border-t border-white/[0.07]">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-white/40">Tickets sold</span>
            <span className="text-white/70 font-medium">{soldTickets}/{totalTickets}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1">
            <div
              className="bg-green-500/60 h-1 rounded-full transition-all"
              style={{ width: `${soldPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
