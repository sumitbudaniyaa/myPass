import { useLocation, useNavigate } from "react-router-dom";
import { TicketCheck } from "lucide-react";
import { useEffect, useRef } from "react";
import { Confetti, type ConfettiRef } from "@/components/magicui/confetti";

const Confirmation = () => {
  const location = useLocation();
  const booking = location.state;
  const navigate = useNavigate();

  const confettiRef = useRef<ConfettiRef>(null);

  useEffect(() => {
    if (!booking) {
      navigate("/");
    } else {
      confettiRef.current?.fire({});
    }
  }, [booking]);

  return (
    <>
      <Confetti ref={confettiRef} className="absolute size-full bottom-0 z-0" />

      <div className="w-screen min-h-screen relative flex flex-col justify-center items-center p-6 z-10 gap-4">
        <div className="bg-green-400/10 border border-green-500/20 rounded-full p-5">
          <TicketCheck
            strokeWidth={"1.5px"}
            size={"3rem"}
            className="text-green-400"
          />
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-white/90 text-2xl font-semibold">
            {booking?.message}
          </p>
          <p className="text-white/30 text-xs font-mono">
            #{booking?.booking?._id}
          </p>
        </div>

        <button
          onClick={() =>
            navigate(`/my-bookings/${booking?.booking?._id}`, {
              state: booking?.booking,
            })
          }
          className="px-5 py-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-full text-white/60 hover:text-white/80 text-sm transition-all cursor-pointer"
        >
          View my tickets →
        </button>
      </div>
    </>
  );
};

export default Confirmation;
