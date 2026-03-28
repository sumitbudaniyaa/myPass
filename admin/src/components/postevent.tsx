import { useState } from "react";
import { X, ImageUp, Trash2, Plus, Clock, Calendar as CalendarIconLucide } from "lucide-react";
import api from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";
import { Calendar } from "@/components/ui/calendar";

type Props = {
  setpostevent: (value: boolean) => void;
  admin: { _id: string };
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
  date: Date;
  time: string;
  description: string;
  category: string;
  ageLimit: string;
  tickets: TicketType[];
  poster: string;
  by: string;
};

const inputClass =
  "w-full bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2.5 text-white/80 text-sm outline-none placeholder:text-white/25 focus:border-white/20 transition-colors";

const buildTime = (hour: number, minute: number, isPM: boolean) => {
  let h = hour % 12;
  if (isPM) h += 12;
  return `${h.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
};

const PostEvent = ({ setpostevent, admin }: Props) => {
  const [loading, setloading] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [timeHour, setTimeHour] = useState<number>(6);
  const [timeMinute, setTimeMinute] = useState<number>(0);
  const [timeIsPM, setTimeIsPM] = useState<boolean>(false);
  const [preview, setPreview] = useState<string>("");

  const [form, setForm] = useState<EventFormType>({
    name: "",
    venue: "",
    city: "",
    state: "",
    date: new Date(),
    time: "",
    description: "",
    category: "",
    ageLimit: "",
    tickets: [{ ticketName: "", price: "", totalTickets: "" }],
    poster: "",
    by: admin._id,
  });

  const handlePoster = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setForm((prev) => ({ ...prev, poster: base64 }));
      setPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTicketField = (index: number, field: keyof TicketType, value: string) => {
    const updated = [...form.tickets];
    updated[index][field] = value;
    setForm((prev) => ({ ...prev, tickets: updated }));
  };

  const handleTicketAdd = () => {
    setForm((prev) => ({
      ...prev,
      tickets: [...prev.tickets, { ticketName: "", price: "", totalTickets: "" }],
    }));
  };

  const handleTicketDelete = (index: number) => {
    const updated = [...form.tickets];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, tickets: updated }));
  };

  const handlePostEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setloading(true);

      const timeStr = buildTime(timeHour, timeMinute, timeIsPM);

      const preparedForm = {
        ...form,
        time: timeStr,
        date: date,
        ageLimit: parseInt(form.ageLimit),
        tickets: form.tickets.map((t) => ({
          ticketName: t.ticketName,
          price: parseFloat(t.price),
          totalTickets: parseInt(t.totalTickets),
        })),
      };

      const res = await api.post(`${import.meta.env.VITE_BACKEND_URL}/api/eventRoute/createEvent`, { preparedForm });
      toast.success(res.data.message);
      setpostevent(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    } finally {
      setloading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4">
        <form
          onSubmit={handlePostEvent}
          className="w-full max-w-xl bg-[#0e0e0e] border border-white/[0.08] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-5 py-4 border-b border-white/[0.07] shrink-0">
            <h2 className="text-white/85 font-semibold text-base">Post Event</h2>
            <button
              type="button"
              onClick={() => setpostevent(false)}
              className="p-1.5 rounded-full bg-white/[0.06] hover:bg-white/10 border border-white/10 text-white/40 hover:text-white/70 transition-all cursor-pointer"
            >
              <X size="0.9rem" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex flex-col gap-5 p-5">
            {/* Poster Upload */}
            <div>
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2">Poster</p>
              {preview ? (
                <div className="relative rounded-xl overflow-hidden">
                  <img src={preview} alt="preview" className="w-full max-h-48 object-cover" />
                  <button
                    type="button"
                    onClick={() => { setPreview(""); setForm((prev) => ({ ...prev, poster: "" })); }}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-sm rounded-full text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    <Trash2 size="0.85rem" />
                  </button>
                </div>
              ) : (
                <>
                  <label
                    htmlFor="poster"
                    className="w-full h-28 rounded-xl bg-white/[0.04] border border-dashed border-white/15 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/[0.07] hover:border-white/25 transition-all"
                  >
                    <ImageUp size="1.5rem" className="text-white/30" />
                    <span className="text-white/35 text-sm">Upload poster</span>
                  </label>
                  <input required id="poster" type="file" accept="image/*" className="hidden" onChange={handlePoster} />
                </>
              )}
            </div>

            {/* Basic Info */}
            <div>
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">Basic Info</p>
              <div className="flex flex-col gap-2">
                <input required type="text" placeholder="Event name" name="name" value={form.name} onChange={handleChange} className={inputClass} />
                <textarea
                  required
                  placeholder="Description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className={inputClass + " min-h-20 resize-none"}
                />
                <div className="grid grid-cols-2 gap-2">
                  <select required name="category" value={form.category} onChange={handleChange} className={inputClass}>
                    <option value="" className="text-black">Category</option>
                    <option value="music" className="text-black">Music</option>
                    <option value="social" className="text-black">Social</option>
                    <option value="college" className="text-black">College</option>
                    <option value="theatre" className="text-black">Theater</option>
                    <option value="tech" className="text-black">Tech</option>
                  </select>
                  <input type="number" placeholder="Age limit" name="ageLimit" value={form.ageLimit} onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">Location</p>
              <div className="flex flex-col gap-2">
                <input required type="text" placeholder="Venue" name="venue" value={form.venue} onChange={handleChange} className={inputClass} />
                <div className="grid grid-cols-2 gap-2">
                  <input required type="text" placeholder="City" name="city" value={form.city} onChange={handleChange} className={inputClass} />
                  <input required type="text" placeholder="State" name="state" value={form.state} onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div>
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">Date & Time</p>
              <div className="flex flex-col gap-3">
                {/* Date picker */}
                <button
                  type="button"
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2.5 text-white/70 text-sm hover:bg-white/[0.09] transition-all cursor-pointer w-full"
                >
                  <CalendarIconLucide size="0.85rem" className="text-white/40" />
                  {date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                </button>
                {showCalendar && (
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(day: any) => {
                        if (day) {
                          setDate(day);
                          setForm((prev) => ({ ...prev, date: day }));
                          setShowCalendar(false);
                        }
                      }}
                      disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                      className="rounded-xl border border-white/10 bg-white/[0.04] text-white"
                    />
                  </div>
                )}

                {/* Time picker */}
                <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5">
                  <Clock size="0.85rem" className="text-white/35 shrink-0" />
                  <div className="flex items-center gap-1.5 flex-1">
                    <select
                      value={timeHour}
                      onChange={(e) => setTimeHour(parseInt(e.target.value))}
                      className="bg-white/[0.06] border border-white/10 rounded-lg px-2 py-1.5 text-white/80 text-sm outline-none cursor-pointer flex-1"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                        <option key={h} value={h} className="text-black">{h.toString().padStart(2, "0")}</option>
                      ))}
                    </select>
                    <span className="text-white/30 text-lg">:</span>
                    <select
                      value={timeMinute}
                      onChange={(e) => setTimeMinute(parseInt(e.target.value))}
                      className="bg-white/[0.06] border border-white/10 rounded-lg px-2 py-1.5 text-white/80 text-sm outline-none cursor-pointer flex-1"
                    >
                      {[0, 15, 30, 45].map((m) => (
                        <option key={m} value={m} className="text-black">{m.toString().padStart(2, "0")}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setTimeIsPM(!timeIsPM)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all cursor-pointer ${
                        timeIsPM
                          ? "bg-white/10 text-white/80 border-white/15"
                          : "bg-white/[0.04] text-white/40 border-white/[0.07]"
                      }`}
                    >
                      {timeIsPM ? "PM" : "AM"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tickets */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Tickets</p>
                <button
                  type="button"
                  onClick={handleTicketAdd}
                  className="flex items-center gap-1 text-white/45 hover:text-white/70 text-xs transition-colors cursor-pointer"
                >
                  <Plus size="0.75rem" /> Add
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {form.tickets.map((ticket, index) => (
                  <div key={index} className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-3 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <p className="text-white/35 text-xs">Ticket {index + 1}</p>
                      {form.tickets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleTicketDelete(index)}
                          className="flex items-center gap-1 text-red-400/60 hover:text-red-400 text-xs transition-colors cursor-pointer"
                        >
                          <Trash2 size="0.7rem" /> Remove
                        </button>
                      )}
                    </div>
                    <input
                      required
                      type="text"
                      placeholder="Ticket name (e.g. General, VIP)"
                      value={ticket.ticketName}
                      onChange={(e) => handleTicketField(index, "ticketName", e.target.value)}
                      className={inputClass}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm pointer-events-none">₹</span>
                        <input
                          required
                          type="number"
                          placeholder="Price"
                          value={ticket.price}
                          onChange={(e) => handleTicketField(index, "price", e.target.value)}
                          className={inputClass + " pl-6"}
                        />
                      </div>
                      <input
                        required
                        type="number"
                        placeholder="Quantity"
                        value={ticket.totalTickets}
                        onChange={(e) => handleTicketField(index, "totalTickets", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-white/[0.07] shrink-0">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/10 hover:bg-white/15 border border-white/15 text-white/85 text-sm font-medium rounded-xl cursor-pointer transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Event"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PostEvent;
