import { ChevronLeft } from "lucide-react";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { CloudCheck } from "lucide-react";
import { Upload } from "lucide-react";
import { formatTo12Hour } from "@/utils/formattime";
import api from "@/utils/api";
import toast from "react-hot-toast";
import Bookings from "./bookings";
import { EllipsisVertical } from "lucide-react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";

type eventPageProp = {
  selectedevent: any;
  seteventPage: (value: boolean) => void;
  refreshFetch: () => void;
};

type TicketType = {
  ticketName: string;
  price: string;
  totalTickets: string;
};

type EventFormType = {
  name: string;
  venue: string;
  city: string;
  state: string;
  date: string;
  time: string;
  description: string;
  category: string;
  poster: string;
  ageLimit: string;
  tickets: TicketType[];
  status: string;
};

const EventPage = ({
  selectedevent,
  seteventPage,
  refreshFetch,
}: eventPageProp) => {
  const [isdelete, setisdelete] = useState<boolean>(false);
  const [isedit, setisedit] = useState<boolean>(false);
  const [options, setoptions] = useState<boolean>(false);
  const navigate = useNavigate();

  const [form, setForm] = useState<EventFormType>({
    name: selectedevent?.name,
    venue: selectedevent?.venue,
    city: selectedevent?.city,
    state: selectedevent?.state,
    date: selectedevent?.date,
    time: selectedevent?.time,
    description: selectedevent?.description,
    category: selectedevent?.category,
    ageLimit: selectedevent?.ageLimit,
    poster: selectedevent?.poster,
    tickets: selectedevent?.tickets.map((ticket: any) => ({
      ticketName: ticket?.ticketName,
      price: ticket?.price,
      totalTickets: ticket?.totalTickets,
      bookedTickets: ticket?.bookedTickets,
    })),
    status: selectedevent?.status,
  });

  const handleTicketChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof TicketType
  ) => {
    const updatedTickets = [...form.tickets];
    updatedTickets[index][field] = e.target.value;
    setForm((prev) => ({ ...prev, tickets: updatedTickets }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updatePoster = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result as string;
      setForm((prev) => ({ ...prev, poster: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleTicketAdd = () => {
    setForm((prev) => ({
      ...prev,
      tickets: [
        ...prev.tickets,
        { ticketName: "", price: "", totalTickets: "" },
      ],
    }));
  };

  const handleTicketDelete = (index: number) => {
    const updatedTickets = [...form.tickets];

    updatedTickets.splice(index, 1);

    setForm((prev) => ({ ...prev, tickets: updatedTickets }));
  };

  const editEvent = async () => {
    try {
      const res = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/eventRoute/editEvent`,
        {
          eventId: selectedevent?._id,
          form,
        }
      );
      toast.success(res.data.message);
      refreshFetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message);
      setForm({
        name: selectedevent.name,
        venue: selectedevent.venue,
        city: selectedevent.city,
        state: selectedevent.state,
        date: selectedevent.date,
        time: selectedevent.time,
        description: selectedevent.description,
        category: selectedevent.category,
        ageLimit: selectedevent.ageLimit,
        poster: selectedevent.poster,
        tickets: selectedevent.tickets.map((ticket: any) => ({
          ticketName: ticket.ticketName,
          price: ticket.price,
          totalTickets: ticket.totalTickets,
          bookedTickets: ticket.bookedTickets,
        })),
        status: selectedevent.status,
      });
    }
  };

  const handleDelete = async (_id: any) => {
    try {
      const res = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/eventRoute/deleteEvent`,
        {
          eventId: _id,
        }
      );
      toast.success(res.data.message);
      setisdelete(false);
      refreshFetch();
      seteventPage(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    }
  };

  return (
    <div className="w-[100%] h-[100%] p-3 overflow-y-auto rounded-md lg:relative bg-[rgba(255,255,255,0.08)] shadow-sm">
      <div className="w-[100%] flex justify-between ">
        <div
          className="flex text-[rgba(255,255,255,0.5)] text-sm items-center cursor-pointer"
          onClick={() => seteventPage(false)}
        >
          <ChevronLeft size={"1rem"} />
          back
        </div>

        {isedit ? (
          form.status === "upcoming" ? (
            <button
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  status: "completed",
                }))
              }
              className="bg-green-900/50 p-1 text-green-500 pl-2 pr-2 text-sm rounded-md"
            >
              Set event as Completed
            </button>
          ) : (
            <button
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  status: "upcoming",
                }))
              }
              className="bg-red-900/50 p-1 text-red-500 pl-2 pr-2 text-sm rounded-md"
            >
              Set event as Upcoming
            </button>
          )
        ) : (
          <button
            onClick={() => {
              setisedit(true);
            }}
            className="p-1 cursor-pointer pl-2 outline-none flex items-center gap-1 pr-2 bg-[rgba(255,255,255,0.2)] text-sm text-[rgba(255,255,255,0.8)] rounded-sm"
          >
            <Pencil size={".9rem"} /> Edit details
          </button>
        )}
      </div>

      <form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          editEvent();
          setisedit(false);
        }}
        className="flex flex-col w-[100%] items-center mt-4"
      >
        <div className="w-[100%] flex flex-col lg:flex-row items-center p-2 gap-2 rounded-md overflow-hidden">
          <img
            src={form.poster}
            className="rounded-md w-[100%] max-h-150 lg:w-[50%]"
            alt="poster"
          />

          {isedit ? (
            <>
              <label
                className="lg:w-[50%] w-[100%] cursor-pointer flex gap-1 text-sm justify-center mt-auto items-center p-1.5 bg-green-500/30 rounded-sm text-[rgba(255,255,255,0.8)] "
                htmlFor="poster"
              >
                {" "}
                <Upload size={"1rem"} /> Upload new poster
              </label>
              <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  updatePoster(e);
                }}
                accept="image/*"
                type="file"
                id="poster"
                className="w-[50%] hidden"
              ></input>
            </>
          ) : (
            ""
          )}
        </div>

        <div className="flex flex-col mt-3 p-1 w-[100%] gap-3 ">
          <p className="lg:text-3xl text-xl md:text-2xl flex justify-between items-center font-semibold w-[100%] text-[rgba(255,255,255,0.8)] text-end">
            <span className="md:text-lg text-sm font-medium text-[rgba(255,255,255,0.5)] text-start">
              Event Name
            </span>
            {isedit ? (
              <input
                required
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e);
                }}
                name="name"
                className="rounded-sm border-1 w-50 md:w-100 p-2 outline-none border-[rgba(255,255,255,0.2)] pl-2 font-medium text-sm"
                value={form.name}
              ></input>
            ) : (
              form.name
            )}
          </p>
          <p className="lg:text-3xl text-xl md:text-2xl flex justify-between items-center font-semibold w-[100%] text-[rgba(255,255,255,0.8)]  text-end">
            <span className="md:text-lg text-sm font-medium text-[rgba(255,255,255,0.5)]">
              Venue
            </span>
            {isedit ? (
              <input
                required
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e);
                }}
                name="venue"
                className="rounded-sm border-1 w-50 md:w-100 p-2 outline-none border-[rgba(255,255,255,0.2)] pl-2 font-medium text-sm"
                value={form.venue}
              ></input>
            ) : (
              form.venue
            )}
          </p>
          <p className="lg:text-3xl text-xl md:text-2xl flex justify-between items-center font-semibold text-[rgba(255,255,255,0.8)]  w-[100%]">
            <span className="md:text-lg text-sm font-medium text-[rgba(255,255,255,0.5)]">
              City
            </span>
            {isedit ? (
              <input
                required
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e);
                }}
                name="city"
                className="rounded-sm border-1 w-50 md:w-100 p-2 outline-none border-[rgba(255,255,255,0.2)] pl-2 font-medium text-sm"
                value={form.city}
              ></input>
            ) : (
              form.city
            )}
          </p>
          <p className="lg:text-3xl text-xl md:text-2xl flex justify-between items-center font-semibold w-[100%] text-[rgba(255,255,255,0.8)]  text-end">
            <span className="md:text-lg text-sm font-medium text-[rgba(255,255,255,0.5)]">
              State
            </span>
            {isedit ? (
              <input
                required
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e);
                }}
                name="state"
                className="rounded-sm border-1 w-50 md:w-100 p-2 outline-none border-[rgba(255,255,255,0.2)] pl-2 font-medium text-sm"
                value={form.state}
              ></input>
            ) : (
              form.state
            )}
          </p>
          <p className="lg:text-3xl text-xl md:text-2xl flex justify-between items-center font-semibold text-[rgba(255,255,255,0.8)]  w-[100%]">
            <span className="md:text-lg text-sm font-medium text-[rgba(255,255,255,0.5)]">
              Date
            </span>
            {isedit ? (
              <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e);
                }}
                type="date"
                value={form.date}
                className="rounded-sm border-1 w-50 md:w-100 p-2 outline-none border-[rgba(255,255,255,0.2)] pl-2 font-medium text-sm"
              ></input>
            ) : (
              new Date(form.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            )}
          </p>
          <p className="lg:text-3xl text-xl md:text-2xl flex justify-between items-center font-semibold text-[rgba(255,255,255,0.8)]  w-[100%]">
            <span className="md:text-lg text-sm font-medium text-[rgba(255,255,255,0.5)]">
              Time
            </span>
            {isedit ? (
              <input
                name="time"
                type="time"
                className="rounded-sm border-1 w-50 md:w-100 p-2 outline-none border-[rgba(255,255,255,0.2)] pl-2 font-medium text-sm"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e);
                }}
              ></input>
            ) : (
              formatTo12Hour(form.time)
            )}
          </p>
          <p className="lg:text-3xl text-xl md:text-2xl flex justify-between items-center font-semibold whitespace-pre-line w-[100%] text-[rgba(255,255,255,0.8)]  text-end">
            <span className="md:text-lg text-sm font-medium text-[rgba(255,255,255,0.5)]">
              Description
            </span>
            {isedit ? (
              <textarea
                required
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  handleChange(e);
                }}
                name="description"
                className="rounded-sm min-h-10 border-1 w-50 md:w-100 p-2 outline-none border-[rgba(255,255,255,0.2)] pl-2 font-medium text-sm"
                value={form.description}
              ></textarea>
            ) : (
              form.description
            )}
          </p>
          <p className="lg:text-3xl text-xl md:text-2xl flex justify-between items-center font-semibold w-[100%] text-[rgba(255,255,255,0.8)]  text-end">
            <span className="md:text-lg text-sm font-medium text-[rgba(255,255,255,0.5)]">
              Category
            </span>
            {isedit ? (
              <select
                required
                id="category"
                name="category"
                value={form.category}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  handleChange(e);
                }}
                className="rounded-sm min-h-10 border-1 w-50 md:w-100 p-2 outline-none border-[rgba(255,255,255,0.2)] pl-2 font-medium text-sm"
              >
                <option className="text-black" value="music">
                  Music
                </option>
                <option className="text-black" value="social">
                  Social
                </option>
                <option className="text-black" value="college">
                  College
                </option>
                <option className="text-black" value="theatre">
                  Theater
                </option>
                <option className="text-black" value="tech">
                  Tech
                </option>
              </select>
            ) : (
              form.category
            )}
          </p>
          <p className="lg:text-3xl text-xl md:text-2xl flex justify-between items-center font-semibold w-[100%] text-[rgba(255,255,255,0.8)]  text-end">
            <span className="md:text-lg text-sm font-medium text-[rgba(255,255,255,0.5)]">
              Age Limit
            </span>
            {isedit ? (
              <input
                required
                name="ageLimit"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e);
                }}
                className="rounded-sm border-1 w-50 md:w-100 p-2 outline-none border-[rgba(255,255,255,0.2)] pl-2 font-medium text-sm"
                value={form.ageLimit}
                type="number"
              ></input>
            ) : (
              form.ageLimit
            )}
          </p>

          <p className="md:text-lg text-sm font-medium text-[rgba(255,255,255,0.5)] mt-3 flex justify-between items-center">
            Ticket Details{" "}
            {isedit ? (
              <button
                onClick={handleTicketAdd}
                className="bg-green-500/30 text-green-200 text-sm p-1 pl-2 pr-2 rounded-md"
              >
                Add ticket
              </button>
            ) : (
              ""
            )}
          </p>

          {form.tickets.map((ticket: any, index: any) => (
            <div
              key={index}
              className="w-[100%] bg-[rgba(255,255,255,0.1)] rounded-md p-3 flex flex-col gap-3 relative"
            >
              {isedit && ticket.bookedTickets === 0 && (
                <button
                  onClick={() => handleTicketDelete(index)}
                  className="sticky right-0 top-0 p-1 bg-red-500/30 text-red-200 rounded-md"
                >
                  Delete
                </button>
              )}

              <div className="w-[100%] flex flex-col justify-between">
                <p className="text-[rgba(255,255,255,0.5)] text-sm font-light lg:text-lg">
                  Ticket Name
                </p>
                <p className=" text-[rgba(255,255,255,0.8)] w-[100%] font-semibold text-2xl flex items-center gap-1">
                  {isedit ? (
                    <input
                      required
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleTicketChange(e, index, "ticketName")
                      }
                      className="rounded-sm border-1 w-[100%] p-2 outline-none border-[rgba(255,255,255,0.2)] pl-2 font-medium text-sm"
                      value={ticket?.ticketName}
                    ></input>
                  ) : (
                    ticket?.ticketName
                  )}
                </p>
                <p className="text-[rgba(255,255,255,0.5)] text-sm font-light mt-3 lg:text-lg">
                  Ticket Price
                </p>
                <p className=" text-[rgba(255,255,255,0.8)] font-semibold w-[100%] text-2xl lg:text-3xl flex items-center gap-1">
                  ₹
                  {isedit ? (
                    <input
                      required
                      type="number"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleTicketChange(e, index, "price")
                      }
                      className="rounded-sm border-1 w-[100%] p-2 outline-none border-[rgba(255,255,255,0.2)] pl-2 font-medium text-sm"
                      value={ticket?.price}
                    ></input>
                  ) : (
                    ticket?.price
                  )}
                </p>
              </div>

              <div className="w-[100%] flex flex-col justify-between">
                <p className="text-[rgba(255,255,255,0.5)] text-sm lg:text-lg font-light">
                  Total Tickets
                </p>
                <p className="text-[rgba(255,255,255,0.8)] font-semibold text-xl lg:text-3xl">
                  {isedit ? (
                    <input
                      required
                      type="number"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleTicketChange(e, index, "totalTickets")
                      }
                      className="rounded-sm border-1 w-[100%] p-2 outline-none border-[rgba(255,255,255,0.2)] pl-2 font-medium text-sm"
                      value={ticket?.totalTickets}
                    ></input>
                  ) : (
                    ticket?.totalTickets
                  )}
                </p>

                <p className="text-[rgba(255,255,255,0.5)] text-sm lg:text-lg font-light mt-3">
                  Booked Tickets
                </p>
                <p className="text-[rgba(255,255,255,0.8)] font-semibold text-xl lg:text-3xl">
                  {ticket?.bookedTickets}
                </p>
              </div>
            </div>
          ))}
        </div>

        {isedit ? (
          <button
            type="submit"
            className="p-1 cursor-pointer flex outline-none mt-2 mb-2 self-end items-center gap-1 pl-2 pr-2 bg-green-500/30 text-sm text-green-200 rounded-sm"
          >
            <CloudCheck size={"1rem"} /> Save details
          </button>
        ) : (
          ""
        )}
      </form>

      {form.tickets.reduce(
        (sum: number, ticket: any) => sum + ticket.bookedTickets,
        0
      ) === 0 ? (
        <div className="w-[100%] flex bg-[rgba(255,255,255,0.1)] justify-between items-center p-2 rounded-md mt-2 text-[rgba(255,255,255,0.5)]">
          <p>Delete Event</p>
          <button
            onClick={() => setisdelete(true)}
            className="p-1 pl-2 pr-2 bg-red-500/30 text-red-200 rounded-sm text-sm cursor-pointer"
          >
            Delete
          </button>
        </div>
      ) : (
        ""
      )}

      {isdelete ? (
        <>
          <div className="inset-0 fixed bg-black/20 backdrop-blur-sm flex items-center justify-center z-40 ">
            {" "}
            <div className="p-5 rounded-md bg-[rgba(21,21,21)] w-[90%] border-1 border-[rgba(255,255,255,0.2)] z-40 flex flex-col text-[rgba(255,255,255,0.8)] gap-3">
              <p>Are you sure you want to delete the event?</p>
              <button
                onClick={() => handleDelete(selectedevent._id)}
                className="text-red-500 bg-red-900/30 cursor-pointer p-1 rounded-sm"
              >
                Delete
              </button>
              <button
                className="bg-[rgba(255,255,255,0.1)] p-1 cursor-pointer rounded-sm"
                onClick={() => setisdelete(false)}
              >
                Cancel
              </button>
            </div>{" "}
          </div>{" "}
        </>
      ) : (
        ""
      )}

      <div className="md:text-lg text-sm font-medium text-[rgba(255,255,255,0.5)] mt-3 flex justify-between items-center relative">
        <p>Bookings</p>{" "}
        {options ? (
          <X
            size={"1rem"}
            className="cursor-pointer"
            onClick={() => setoptions(false)}
          />
        ) : (
          <EllipsisVertical
            size={"1rem"}
            className="cursor-pointer"
            onClick={() => setoptions(true)}
          />
        )}
        {options ? (
          <div className="absolute bg-[rgba(21,21,21)] border-1 border-[rgba(255,255,255,0.3)] rounded-sm right-0 top-10 p-3">
            <button
              onClick={() =>
                navigate("/dashboard/sendmail", { state: selectedevent?._id })
              }
              className={`flex items-center gap-2 text-sm cursor-pointer ${
                form.tickets.reduce(
                  (sum: number, ticket: any) => sum + ticket.bookedTickets,
                  0
                ) > 0
                  ? ""
                  : "cursor-not-allowed pointer-events-none opacity-50"
              }`}
            >
              {" "}
              <Mail size={"1rem"} /> Send Mail
            </button>
          </div>
        ) : (
          ""
        )}
      </div>

      <Bookings eventId={selectedevent._id} />
    </div>
  );
};

export default EventPage;
