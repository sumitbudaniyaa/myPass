import { useLocation, useNavigate } from "react-router-dom";
import api from "@/utils/api";
import { useState } from "react";
import toast from "react-hot-toast";
import { ChevronLeft, Mail, Send, FileText } from "lucide-react";

const SendMail = () => {
  const location = useLocation();
  const eventid = location.state;
  const navigate = useNavigate();
  const [subject, setsubject] = useState<string>("");
  const [body, setbody] = useState<string>("");
  const [loading, setloading] = useState<boolean>(false);

  const sendMail = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setloading(true);
      const res = await api.post(`${import.meta.env.VITE_BACKEND_URL}/api/eventRoute/personalMail`, {
        eventid,
        subject,
        body,
      });
      toast.success(res.data.message);
      setbody("");
      setsubject("");
    } catch {
      toast.error("Failed to send mail");
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="w-full min-h-screen p-4 lg:p-5">
      {/* Header */}
      <button
        onClick={() => navigate("/dashboard/events")}
        className="flex items-center gap-1 text-white/40 hover:text-white/65 text-sm transition-colors cursor-pointer mb-5"
      >
        <ChevronLeft size="0.9rem" />
        Back
      </button>

      {/* Title */}
      <div className="mb-6">
        <h1 className="text-white/85 font-semibold text-xl">Send Personalized Mail</h1>
        <p className="text-white/35 text-sm mt-1 leading-relaxed">
          Each attendee of this event will receive a personalized email with their name included.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={sendMail} className="flex flex-col gap-4">
        {/* Subject */}
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.07]">
            <Mail size="0.85rem" className="text-white/30" />
            <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Subject</p>
          </div>
          <div className="p-4">
            <input
              required
              type="text"
              value={subject}
              onChange={(e) => setsubject(e.target.value)}
              placeholder="Email subject line"
              className="w-full bg-transparent text-white/80 text-sm outline-none placeholder:text-white/25"
            />
          </div>
        </div>

        {/* Body */}
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.07]">
            <FileText size="0.85rem" className="text-white/30" />
            <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Message</p>
          </div>
          <div className="p-4">
            <textarea
              required
              value={body}
              onChange={(e) => setbody(e.target.value)}
              placeholder="Write your message here..."
              rows={8}
              className="w-full bg-transparent text-white/80 text-sm outline-none placeholder:text-white/25 resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Preview hint */}
        {subject && body && (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3">
            <p className="text-white/25 text-xs mb-1">Preview</p>
            <p className="text-white/50 text-xs">
              Hi <span className="text-white/70">[Name]</span>, {body.slice(0, 80)}{body.length > 80 ? "..." : ""}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 py-2.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white/80 text-sm font-medium rounded-xl cursor-pointer transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size="0.85rem" /> Send to all attendees
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SendMail;
