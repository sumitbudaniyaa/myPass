import { useLocation } from "react-router-dom";
import api from "@/utils/api";
import { useState } from "react";
import toast from "react-hot-toast";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SendMail = () => {
  const location = useLocation();
  const eventid = location.state;
  const navigate = useNavigate();
  const [subject, setsubject] = useState<any>(null);
  const [body, setbody] = useState<any>(null);
  const [loading, setloading] = useState<boolean>(false);

  const sendMail = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setloading(true);
      const res = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/eventRoute/personalMail`,
        {
          eventid,
          subject,
          body,
        }
      );
      toast.success(res.data.message);
      setbody("");
      setsubject("");
    } catch (err) {
      setloading(false);
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="w-full min-h-screen h-20 flex flex-col p-3">
      <p
        onClick={() => navigate("/dashboard/events")}
        className="text-[rgba(255,255,255,0.4)] text-sm flex items-center gap-1 cursor-pointer"
      >
        {" "}
        <ChevronLeft size={"1rem"} />
        back
      </p>

      <p className="text-[rgba(255,255,255,0.8)] text-2xl mt-3 font-semibold">
        Send Personalized Mails
      </p>
      <p className="text-[rgba(255,255,255,0.5)] text-sm">
        A personalized email will be sent individually to all users who have
        booked tickets for this event. Each email will include the attendee's
        name and will be sent from our official company email address.
      </p>

      <form
        onSubmit={(e) => sendMail(e)}
        className="p-3 rounded-md bg-white/10 mt-5 flex flex-col"
      >
        <p className="text-[rgba(255,255,255,0.5)] text-sm">Email Subject</p>
        <input
          required
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setsubject(e.target.value)
          }
          type="text"
          value={subject}
          placeholder="Subject of email"
          className="w-full border-1 border-[rgba(255,255,255,0.2)] p-2 rounded-sm outline-none mt-1 text-white"
        />
        <p className="text-[rgba(255,255,255,0.5)] mt-5 text-sm">Email body</p>
        <textarea
          required
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setbody(e.target.value)
          }
          name="emailbody"
          value={body}
          id="emailbody"
          placeholder="Content of email"
          className="w-full border-1 border-[rgba(255,255,255,0.2)] p-2 rounded-sm outline-none mt-1 text-white"
        ></textarea>

        <button
          type="submit"
          className={`p-1 pl-2 pr-2 text-sm bg-white ${
            loading ? "opacity-40 pointer-events-none cursor-not-allowed" : ""
          } rounded-sm mt-4 self-end cursor-pointer`}
        >
          {loading ? "sending mail..." : "Send Mail"}
        </button>
      </form>
    </div>
  );
};

export default SendMail;
