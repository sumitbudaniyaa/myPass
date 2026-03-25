import { formatTo12Hour } from "@/utils/formattime";

type EventCardProps = {
  event: any;
  seteventPage: (value: boolean) => void;
  setselectedevent: any;
};

const EventCard = ({
  event,
  seteventPage,
  setselectedevent,
}: EventCardProps) => {
  return (
    <div
      onClick={() => {
        seteventPage(true);
        setselectedevent(event);
      }}
      className="w-[100%] cursor-pointer sm:w-[45%] md:w-[30] lg:w-[30%] min-h-50 sm:min-h-90 lg:min-h-8 flex flex-col p-3 shadow-sm justify-between bg-[rgba(255,255,255,0.08)] rounded-md shrink-0"
    >
      <div className="w-[100%] flex items-center justify-between">
        <div className="p-1 pl-2 pr-2 rounded-sm text-sm bg-[rgba(255,255,255,0.2)] gap-1 items-center justify-center text-[rgba(255,255,255,0.8)]  font-semibold">
          <span className="font-light text-sm">sold</span>{" "}
          {event.tickets?.reduce(
            (sold: number, ticket: any) => sold + (ticket.bookedTickets || 0),
            0
          )}
          /
          {event.tickets?.reduce(
            (total: number, ticket: any) => total + (ticket.totalTickets || 0),
            0
          )}
        </div>
      </div>
      <div className="flex w-[100%] mt-4">
        <img
          src={event.poster}
          alt=""
          className="w-[50%] rounded-sm min-h-50 max-h-60 lg:max-h-50 shrink-0"
        />

        <div className="w-[50%] flex flex-col justify-center items-end pr-1 gap-1 text-[rgba(255,255,255,0.8)]">
          <p className="text-xl font-semibold text-end ">{event.name}</p>
          <p className="text-sm text-end">{event.venue}</p>
          <p className="text-sm">
            {" "}
            {new Date(event.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
          <p className="text-sm">{formatTo12Hour(event.time)}</p>
        </div>
      </div>
      <div
        className={` ${
          event.status === "upcoming"
            ? "bg-green-900/30 text-green-500"
            : "bg-red-900/30 text-red-500"
        }   flex p-1 pl-2 mt-4 rounded-sm text-sm `}
      >
        {event.status}
      </div>
    </div>
  );
};

export default EventCard;
