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

      <div className="w-screen min-h-screen relative flex flex-col justify-center p-2 z-10">
        <TicketCheck
          strokeWidth={"1px"}
          size={"5rem"}
          className="mt-10 self-center text-green-950 p-4 bg-green-400 rounded-4xl"
        />

        <p className="mt-3 text-[rgba(255,255,255,0.8)] text-2xl self-center gap-1">
          {booking?.message}
        </p>
        <p className="mt-1 self-center text-xs text-[rgba(255,255,255,0.4)]">
          #{booking?.booking?._id}
        </p>
        <button
          onClick={() =>
            navigate(`/my-bookings/${booking?.booking?._id}`, {
              state: booking?.booking,
            })
          }
          className="text-sm cursor-pointer p-1 pr-2 pl-2 bg-[rgba(255,255,255,0.1)] rounded-md mt-2 text-[rgba(255,255,255,0.5)] self-center"
        >
          Click here to view tickets
        </button>
      </div>
    </>
  );
};

export default Confirmation;
