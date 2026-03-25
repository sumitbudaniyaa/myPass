import { useState } from "react";
import { X } from "lucide-react";
import { ImageUp } from "lucide-react";
import { Trash2 } from "lucide-react";
import { BadgePlus } from "lucide-react";
import api from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";
import { Calendar } from "@/components/ui/calendar";

type Props = {
  setpostevent: (value: boolean) => void;
  admin: {
    _id: string;
  };
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

const PostEvent = ({ setpostevent, admin }: Props) => {
  const [loading, setloading] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date());

  const [form, setForm] = useState<EventFormType>({
    name: "",
    venue: "",
    city: "",
    state: "",
    date: date,
    time: "",
    description: "",
    category: "",
    ageLimit: "",
    tickets: [{ ticketName: "", price: "", totalTickets: "" }],
    poster: "",
    by: admin._id,
  });

  const [preview, setPreview] = useState<string>("");

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTicketPriceChange = (index: number, value: string) => {
    const updated = [...form.tickets];
    updated[index].price = value;
    setForm((prev) => ({ ...prev, tickets: updated }));
  };

  const handleTicketNameChange = (index: number, value: string) => {
    const updated = [...form.tickets];
    updated[index].ticketName = value;
    setForm((prev) => ({ ...prev, tickets: updated }));
  };

  const handleTicketTotalChange = (index: number, value: string) => {
    const updated = [...form.tickets];
    updated[index].totalTickets = value;
    setForm((prev) => ({ ...prev, tickets: updated }));
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

  const handlePostEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setloading(true);

      const preparedForm = {
        ...form,
        ageLimit: parseInt(form.ageLimit),
        tickets: form.tickets.map((t) => ({
          ticketName: t.ticketName,
          price: parseFloat(t.price),
          totalTickets: parseInt(t.totalTickets),
        })),
      };

      const res = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/eventRoute/createEvent`,
        {
          preparedForm,
        }
      );
      setForm({
        name: "",
        venue: "",
        city: "",
        state: "",
        date: date,
        time: "",
        description: "",
        category: "",
        ageLimit: "",
        tickets: [{ ticketName: "", price: "", totalTickets: "" }],
        poster: "",
        by: admin._id,
      });
      setPreview("");
      toast.success(res.data.message);
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    } finally {
      setloading(false);
      setpostevent(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          handlePostEvent(e);
        }}
        className={`w-screen bg-[rgba(21,21,21,0.7)] flex flex-col text-black absolute top-0 left-0 p-5 lg:w-[70%] lg:h-[90%] lg:ml-[50%] lg:top-[50%]  lg:translate-y-[-50%] lg:translate-x-[-50%] overflow-y-scroll lg:rounded-md lg:shadow-md
        }`}
      >
        <div className="w-[100%] flex justify-between text-xl font-medium items-center">
          {" "}
          <h2 className="text-[rgba(255,255,255,0.8)] font-semibold text-xl lg:text-2xl">
            Event details
          </h2>{" "}
          <X
            size={"2rem"}
            onClick={() => setpostevent(false)}
            className="cursor-pointer text-[rgba(255,255,255,0.8)]"
          />{" "}
        </div>

        <div className="w-[100%] mt-5 relative flex justify-center items-center">
          {preview ? (
            <div className="w-100 flex justify-center ">
              <img
                src={preview}
                alt="preview"
                className="w-[50%] rounded-sm relative"
              />
              <Trash2
                onClick={() => {
                  setPreview("");
                  setForm((prev) => ({ ...prev, poster: "" }));
                }}
                size={"1rem"}
                className="absolute bottom-0 right-0 text-red-600 cursor-pointer"
              />
            </div>
          ) : (
            <>
              <label
                htmlFor="poster"
                className="w-[100%] h-25 rounded-sm bg-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.8)] border-dashed border-2 border-[rgba(255,255,255,0.8)] flex items-center justify-center text-xl font-medium gap-2 cursor-pointer lg:w-[100%]"
              >
                Upload Poster <ImageUp />
              </label>
              <input
                required
                id="poster"
                type="file"
                accept="image/*"
                className="w-[100%] border-1 bg-neutral-80 hidden"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handlePoster(e)
                }
              />
            </>
          )}
        </div>

        <input
          required
          type="text"
          placeholder="Name"
          className="w-full border-1 border-[rgba(255,255,255,0.8)] rounded-md h-10 text-[rgba(255,255,255,0.8)] outline-none pt-2 pb-2 pl-2 mt-5"
          name="name"
          value={form.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(e);
          }}
        />
        <input
          required
          type="text"
          placeholder="Venue"
          className="w-full border-1 border-[rgba(255,255,255,0.8)] rounded-md h-10 text-[rgba(255,255,255,0.8)] outline-none pt-2 pb-2 pl-2 mt-3"
          name="venue"
          value={form.venue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(e);
          }}
        />
        <input
          required
          type="text"
          placeholder="City"
          className="w-full border-1 border-[rgba(255,255,255,0.8)] rounded-md h-10 text-[rgba(255,255,255,0.8)] outline-none pt-2 pb-2 pl-2 mt-3"
          name="city"
          value={form.city}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(e);
          }}
        />
        <input
          required
          type="text"
          placeholder="State"
          value={form.state}
          className="w-full border-1 border-[rgba(255,255,255,0.8)] rounded-md h-10 text-[rgba(255,255,255,0.8)] outline-none pt-2 pb-2 pl-2 mt-3"
          name="state"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(e);
          }}
        />

        <label htmlFor="date" className="mt-3 text-[rgba(255,255,255,0.8)]">
          Select Date
        </label>
        <Calendar
          required
          id="date"
          mode="single"
          selected={date}
          onSelect={(day: Date) => {
            setDate(day);
            setForm((prev) => ({ ...prev, date: day }));
          }}
          className="rounded-lg border self-center mt-1 bg-[rgba(255,255,255,0.1)] text-white"
        />
        <label htmlFor="time" className="mt-3 text-[rgba(255,255,255,0.8)]">
          Select Time
        </label>
        <div className="w-[100%] flex mt-1 justify-between">
          <input
            required
            id="time"
            type="time"
            value={form.time}
            className="w-[100%] border-1 border-[rgba(255,255,255,0.8)] rounded-md h-10 text-[rgba(255,255,255,0.8)] outline-none pt-2 pb-2 pl-2"
            name="time"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleChange(e);
            }}
          />
        </div>
        {form.tickets.map((ticket, index) => (
          <div
            key={index}
            className=" shadow-sm flex flex-col bg-[rgba(255,255,255,0.1)] p-5 mt-3 rounded-md"
          >
            <input
              value={ticket.ticketName}
              required
              type="text"
              placeholder="Ticket Name"
              className="w-full border-1 border-[rgba(255,255,255,0.8)] rounded-md h-10 text-[rgba(255,255,255,0.8)] outline-none pt-2 pb-2 pl-2"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleTicketNameChange(index, e.target.value);
              }}
            />
            <input
              value={ticket.price}
              required
              type="number"
              placeholder="Ticket Price"
              className="w-full border-1 border-[rgba(255,255,255,0.8)] rounded-md h-10 text-[rgba(255,255,255,0.8)] outline-none pt-2 pb-2 pl-2 mt-3"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleTicketPriceChange(index, e.target.value);
              }}
            />
            <input
              value={ticket.totalTickets}
              required
              type="number"
              placeholder="Total Tickets"
              className="w-full border-1 border-[rgba(255,255,255,0.8)] rounded-md h-10 text-[rgba(255,255,255,0.8)] outline-none pt-2 pb-2 pl-2 mt-3"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleTicketTotalChange(index, e.target.value);
              }}
            />
            {form.tickets.length > 1 ? (
              <button
                type="button"
                className="flex justify-center items-center cursor-pointer mt-3 bg-red-500/30 p-1.5 rounded-md text-[rgba(255,255,255,0.8)] gap-1"
                onClick={() => handleTicketDelete(index)}
              >
                Remove <Trash2 size={"1rem"} />
              </button>
            ) : (
              ""
            )}
          </div>
        ))}

        <button
          onClick={handleTicketAdd}
          type="button"
          className="p-2 flex justify-center items-center gap-1 text-[rgba(255,255,255,0.8)] mt-3 cursor-pointer w-[100%]"
        >
          Add more tickets{" "}
          <BadgePlus
            size={"2.5rem"}
            fill="transparent"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth={".1rem"}
          />
        </button>

        <textarea
          required
          placeholder="Description"
          name="description"
          value={form.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            handleChange(e);
          }}
          className="w-full min-h-20 border-1 border-[rgba(255,255,255,0.8)] rounded-md h-10 text-[rgba(255,255,255,0.8)] outline-none pt-2 pb-2 pl-2 mt-3"
        />
        <label htmlFor="category" className="mt-3 text-[rgba(255,255,255,0.8)]">
          Select Category
        </label>
        <select
          required
          id="category"
          name="category"
          value={form.category}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            handleChange(e);
          }}
          className="w-full border-1 border-[rgba(255,255,255,0.8)] rounded-md h-10 text-[rgba(255,255,255,0.8)] outline-none pt-2 pb-2 pl-2 mt-1"
        >
          <option value="none" className="text-black" selected>
            None
          </option>
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
        <input
          type="number"
          placeholder="Age Limit"
          name="ageLimit"
          value={form.ageLimit}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(e);
          }}
          className="w-full border-1 border-[rgba(255,255,255,0.8)] rounded-md h-10 text-[rgba(255,255,255,0.8)] outline-none pt-2 pb-2 pl-2 mt-3"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-3  self-end bg-white text-md text-black p-1 pl-2 pr-2 rounded-sm font-medium cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:pl-3 disabled:pr-3 disabled:p-2"
        >
          {loading ? (
            <div className="flex flex-row gap-2">
              <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-.5s]"></div>
            </div>
          ) : (
            "Post Event"
          )}
        </button>
      </form>
    </>
  );
};

export default PostEvent;
