import { ChevronLeft, Pencil, CloudCheck, Upload, EllipsisVertical, X, Mail, Plus, Trash2, Calendar as CalendarIcon, Clock } from "lucide-react";
import { useState } from "react";
import { formatTo12Hour } from "@/utils/formattime";
import api from "@/utils/api";
import toast from "react-hot-toast";
import Bookings from "./bookings";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";

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

const inputClass =
  "w-full bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-white/80 text-sm outline-none placeholder:text-white/25 focus:border-white/20 transition-colors";

const parseTime = (timeStr: string) => {
  if (!timeStr) return { hour: 12, minute: 0, isPM: false };
  const [h, m] = timeStr.split(":").map(Number);
  const isPM = h >= 12;
  const hour12 = h % 12 || 12;
  return { hour: hour12, minute: isNaN(m) ? 0 : m, isPM };
};

const buildTime = (hour: number, minute: number, isPM: boolean) => {
  let h = hour % 12;
  if (isPM) h += 12;
  return `${h.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
};

const EventPage = ({ selectedevent, seteventPage, refreshFetch }: eventPageProp) => {
  const [isdelete, setisdelete] = useState<boolean>(false);
  const [isedit, setisedit] = useState<boolean>(false);
  const [options, setoptions] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
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

  const timeParts = parseTime(form.time);

  const handleTimeChange = (field: "hour" | "minute" | "isPM", value: any) => {
    const updated = { ...timeParts, [field]: value };
    setForm((prev) => ({ ...prev, time: buildTime(updated.hour, updated.minute, updated.isPM) }));
  };

  const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: keyof TicketType) => {
    const updatedTickets = [...form.tickets];
    updatedTickets[index][field] = e.target.value;
    setForm((prev) => ({ ...prev, tickets: updatedTickets }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updatePoster = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm((prev) => ({ ...prev, poster: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleTicketAdd = () => {
    setForm((prev) => ({
      ...prev,
      tickets: [...prev.tickets, { ticketName: "", price: "", totalTickets: "" }],
    }));
  };

  const handleTicketDelete = (index: number) => {
    const updatedTickets = [...form.tickets];
    updatedTickets.splice(index, 1);
    setForm((prev) => ({ ...prev, tickets: updatedTickets }));
  };

  const editEvent = async () => {
    try {
      const res = await api.post(`${import.meta.env.VITE_BACKEND_URL}/api/eventRoute/editEvent`, {
        eventId: selectedevent?._id,
        form,
      });
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
      const res = await api.post(`${import.meta.env.VITE_BACKEND_URL}/api/eventRoute/deleteEvent`, { eventId: _id });
      toast.success(res.data.message);
      setisdelete(false);
      refreshFetch();
      seteventPage(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    }
  };

  const totalBooked = form.tickets.reduce((sum: number, ticket: any) => sum + (ticket.bookedTickets || 0), 0);

  return (
    <div className="w-full min-h-screen p-4 lg:p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <button
          onClick={() => seteventPage(false)}
          className="flex items-center gap-1 text-white/45 hover:text-white/70 text-sm transition-colors cursor-pointer"
        >
          <ChevronLeft size="0.9rem" />
          Back
        </button>

        <div className="flex items-center gap-2">
          {isedit ? (
            <>
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    status: prev.status === "upcoming" ? "completed" : "upcoming",
                  }))
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                  form.status === "upcoming"
                    ? "bg-green-950/80 text-green-400 border-green-700/30"
                    : "bg-red-950/80 text-red-400 border-red-700/30"
                }`}
              >
                {form.status === "upcoming" ? "Mark Completed" : "Mark Upcoming"}
              </button>
            </>
          ) : null}

          <div className="relative">
            <button
              onClick={() => setoptions(!options)}
              className="p-1.5 rounded-full bg-white/[0.06] hover:bg-white/10 border border-white/10 text-white/40 hover:text-white/70 transition-all cursor-pointer"
            >
              {options ? <X size="0.85rem" /> : <EllipsisVertical size="0.85rem" />}
            </button>
            {options && (
              <div className="absolute right-0 top-9 bg-[#151515] border border-white/10 rounded-xl p-1.5 z-10 min-w-36 shadow-xl">
                <button
                  onClick={() => navigate("/dashboard/sendmail", { state: selectedevent?._id })}
                  disabled={totalBooked === 0}
                  className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg text-white/60 hover:text-white/90 hover:bg-white/[0.06] w-full transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                >
                  <Mail size="0.85rem" /> Send Mail
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          editEvent();
          setisedit(false);
          setShowCalendar(false);
        }}
        className="flex flex-col gap-5"
      >
        {/* Poster */}
        <div className="relative rounded-2xl overflow-hidden">
          <img src={form.poster} alt={form.name} className="w-full max-h-72 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
            <div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                form.status === "upcoming"
                  ? "bg-green-950/80 text-green-400 border-green-700/30"
                  : "bg-red-950/80 text-red-400 border-red-700/30"
              }`}>
                {form.status}
              </span>
            </div>
            {isedit && (
              <label
                htmlFor="poster"
                className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm border border-white/20 text-white/80 text-xs px-3 py-1.5 rounded-full cursor-pointer hover:bg-black/70 transition-all"
              >
                <Upload size="0.75rem" /> Change poster
              </label>
            )}
          </div>
          <input onChange={updatePoster} accept="image/*" type="file" id="poster" className="hidden" />
        </div>

        {/* Event Info Section */}
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 border-b border-white/[0.07]">
            <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Event Info</p>
            {!isedit ? (
              <button
                type="button"
                onClick={() => setisedit(true)}
                className="flex items-center gap-1.5 text-white/45 hover:text-white/70 text-xs transition-colors cursor-pointer"
              >
                <Pencil size="0.75rem" /> Edit
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center gap-1.5 bg-green-950/60 text-green-400 border border-green-700/30 text-xs px-3 py-1 rounded-full cursor-pointer hover:bg-green-950/80 transition-all"
              >
                <CloudCheck size="0.75rem" /> Save
              </button>
            )}
          </div>

          <div className="divide-y divide-white/[0.06]">
            {/* Name */}
            <div className="px-4 py-3 flex justify-between items-center gap-4">
              <p className="text-white/40 text-xs shrink-0 w-24">Name</p>
              {isedit ? (
                <input required name="name" value={form.name} onChange={handleChange} className={inputClass + " text-right"} />
              ) : (
                <p className="text-white/85 text-sm font-medium text-right">{form.name}</p>
              )}
            </div>

            {/* Category */}
            <div className="px-4 py-3 flex justify-between items-center gap-4">
              <p className="text-white/40 text-xs shrink-0 w-24">Category</p>
              {isedit ? (
                <select required name="category" value={form.category} onChange={handleChange}
                  className={inputClass + " text-right"}>
                  <option className="text-black" value="music">Music</option>
                  <option className="text-black" value="social">Social</option>
                  <option className="text-black" value="college">College</option>
                  <option className="text-black" value="theatre">Theater</option>
                  <option className="text-black" value="tech">Tech</option>
                </select>
              ) : (
                <p className="text-white/85 text-sm capitalize text-right">{form.category}</p>
              )}
            </div>

            {/* Age Limit */}
            <div className="px-4 py-3 flex justify-between items-center gap-4">
              <p className="text-white/40 text-xs shrink-0 w-24">Age Limit</p>
              {isedit ? (
                <input required name="ageLimit" type="number" value={form.ageLimit} onChange={handleChange} className={inputClass + " text-right"} />
              ) : (
                <p className="text-white/85 text-sm text-right">{form.ageLimit}+</p>
              )}
            </div>

            {/* Description */}
            <div className="px-4 py-3 flex flex-col gap-2">
              <p className="text-white/40 text-xs">Description</p>
              {isedit ? (
                <textarea required name="description" value={form.description} onChange={handleChange}
                  className={inputClass + " min-h-20 resize-none"} />
              ) : (
                <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">{form.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.07]">
            <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Location</p>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {[
              { label: "Venue", name: "venue" },
              { label: "City", name: "city" },
              { label: "State", name: "state" },
            ].map(({ label, name }) => (
              <div key={name} className="px-4 py-3 flex justify-between items-center gap-4">
                <p className="text-white/40 text-xs shrink-0 w-24">{label}</p>
                {isedit ? (
                  <input required name={name} value={(form as any)[name]} onChange={handleChange} className={inputClass + " text-right"} />
                ) : (
                  <p className="text-white/85 text-sm text-right">{(form as any)[name]}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Date & Time Section */}
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.07]">
            <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Date & Time</p>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {/* Date */}
            <div className="px-4 py-3">
              <div className="flex justify-between items-center">
                <p className="text-white/40 text-xs">Date</p>
                {isedit ? (
                  <button
                    type="button"
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-white/70 text-sm hover:bg-white/[0.09] transition-all cursor-pointer"
                  >
                    <CalendarIcon size="0.8rem" />
                    {new Date(form.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </button>
                ) : (
                  <p className="text-white/85 text-sm">
                    {new Date(form.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                )}
              </div>
              {isedit && showCalendar && (
                <div className="mt-3 flex justify-center">
                  <Calendar
                    mode="single"
                    selected={new Date(form.date)}
                    onSelect={(day: any) => {
                      if (day) {
                        const iso = day.toISOString().split("T")[0];
                        setForm((prev) => ({ ...prev, date: iso }));
                        setShowCalendar(false);
                      }
                    }}
                    className="rounded-xl border border-white/10 bg-white/[0.04] text-white"
                  />
                </div>
              )}
            </div>

            {/* Time */}
            <div className="px-4 py-3">
              <div className="flex justify-between items-center">
                <p className="text-white/40 text-xs">Time</p>
                {isedit ? (
                  <div className="flex items-center gap-1.5">
                    <Clock size="0.8rem" className="text-white/30" />
                    <select
                      value={timeParts.hour}
                      onChange={(e) => handleTimeChange("hour", parseInt(e.target.value))}
                      className="bg-white/[0.06] border border-white/10 rounded-lg px-2 py-1.5 text-white/80 text-sm outline-none cursor-pointer"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                        <option key={h} value={h} className="text-black">{h.toString().padStart(2, "0")}</option>
                      ))}
                    </select>
                    <span className="text-white/30">:</span>
                    <select
                      value={timeParts.minute}
                      onChange={(e) => handleTimeChange("minute", parseInt(e.target.value))}
                      className="bg-white/[0.06] border border-white/10 rounded-lg px-2 py-1.5 text-white/80 text-sm outline-none cursor-pointer"
                    >
                      {[0, 15, 30, 45].map((m) => (
                        <option key={m} value={m} className="text-black">{m.toString().padStart(2, "0")}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleTimeChange("isPM", !timeParts.isPM)}
                      className={`px-2.5 py-1.5 rounded-lg text-sm font-medium border transition-all cursor-pointer ${
                        timeParts.isPM
                          ? "bg-white/10 text-white/80 border-white/15"
                          : "bg-white/[0.04] text-white/40 border-white/[0.07]"
                      }`}
                    >
                      {timeParts.isPM ? "PM" : "AM"}
                    </button>
                  </div>
                ) : (
                  <p className="text-white/85 text-sm">{formatTo12Hour(form.time)}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tickets Section */}
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 border-b border-white/[0.07]">
            <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Tickets</p>
            {isedit && (
              <button
                type="button"
                onClick={handleTicketAdd}
                className="flex items-center gap-1 text-white/50 hover:text-white/80 text-xs transition-colors cursor-pointer"
              >
                <Plus size="0.75rem" /> Add ticket
              </button>
            )}
          </div>

          <div className="divide-y divide-white/[0.06]">
            {form.tickets.map((ticket: any, index: number) => {
              const soldPercent = ticket.totalTickets > 0
                ? Math.round((ticket.bookedTickets / ticket.totalTickets) * 100)
                : 0;
              return (
                <div key={index} className="px-4 py-3 flex flex-col gap-3">
                  {isedit ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <p className="text-white/40 text-xs">Ticket {index + 1}</p>
                        {ticket.bookedTickets === 0 && (
                          <button
                            type="button"
                            onClick={() => handleTicketDelete(index)}
                            className="flex items-center gap-1 text-red-400/70 hover:text-red-400 text-xs transition-colors cursor-pointer"
                          >
                            <Trash2 size="0.7rem" /> Remove
                          </button>
                        )}
                      </div>
                      <input
                        required
                        placeholder="Ticket name"
                        value={ticket.ticketName}
                        onChange={(e) => handleTicketChange(e, index, "ticketName")}
                        className={inputClass}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">₹</span>
                          <input
                            required
                            type="number"
                            placeholder="Price"
                            value={ticket.price}
                            onChange={(e) => handleTicketChange(e, index, "price")}
                            className={inputClass + " pl-6"}
                          />
                        </div>
                        <input
                          required
                          type="number"
                          placeholder="Total qty"
                          value={ticket.totalTickets}
                          onChange={(e) => handleTicketChange(e, index, "totalTickets")}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <p className="text-white/85 text-sm font-medium">{ticket.ticketName}</p>
                        <p className="text-white/70 text-sm font-semibold">₹{ticket.price}</p>
                      </div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/35">{ticket.bookedTickets} sold</span>
                        <span className="text-white/50">{ticket.totalTickets} total · {soldPercent}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1">
                        <div className="bg-green-500/60 h-1 rounded-full transition-all" style={{ width: `${soldPercent}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </form>

      {/* Bookings Section */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3 relative">
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Bookings</p>
          <div className="flex items-center gap-2">
            <span className="text-white/30 text-xs">{totalBooked} attendees</span>
          </div>
        </div>
        <Bookings eventId={selectedevent._id} />
      </div>

      {/* Delete Event */}
      {totalBooked === 0 && (
        <div className="mt-5 bg-red-950/20 border border-red-700/20 rounded-2xl p-4 flex justify-between items-center">
          <div>
            <p className="text-white/60 text-sm font-medium">Delete Event</p>
            <p className="text-white/30 text-xs mt-0.5">This action cannot be undone</p>
          </div>
          <button
            onClick={() => setisdelete(true)}
            className="bg-red-950/60 border border-red-700/30 text-red-400 text-sm px-4 py-1.5 rounded-full cursor-pointer hover:bg-red-950/80 transition-all"
          >
            Delete
          </button>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {isdelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-[90%] max-w-sm flex flex-col gap-4 shadow-2xl">
            <div>
              <p className="text-white/85 font-semibold">Delete event?</p>
              <p className="text-white/40 text-sm mt-1">This will permanently remove the event and all its data.</p>
            </div>
            <button
              onClick={() => handleDelete(selectedevent._id)}
              className="w-full bg-red-950/60 border border-red-700/30 text-red-400 py-2.5 rounded-xl text-sm font-medium cursor-pointer hover:bg-red-950/80 transition-all"
            >
              Delete event
            </button>
            <button
              onClick={() => setisdelete(false)}
              className="w-full bg-white/[0.06] border border-white/10 text-white/60 py-2.5 rounded-xl text-sm cursor-pointer hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPage;
