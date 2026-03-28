import { Tickets, Settings2, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type NavTabProps = {
  setisLoggedIn: (value: boolean) => void;
  setnavtab: (value: boolean) => void;
};

const NavTab = ({ setisLoggedIn, setnavtab }: NavTabProps) => {
  const navigate = useNavigate();

  return (
    <div className="fixed right-3 top-[7vh] mt-1 w-48 bg-[rgba(18,18,18,0.97)] border border-white/10 rounded-xl shadow-2xl z-[70] overflow-hidden backdrop-blur-xl">
      <ul className="list-none flex flex-col p-1.5 gap-0.5 text-white/60">
        <li
          onClick={() => { navigate("/my-bookings"); setnavtab(false); }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/[0.07] hover:text-white/90 transition-all duration-150 text-sm"
        >
          <Tickets size={"1rem"} />
          My Bookings
        </li>
        <li
          onClick={() => { navigate("/account"); setnavtab(false); }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/[0.07] hover:text-white/90 transition-all duration-150 text-sm"
        >
          <Settings2 size={"1rem"} />
          Account
        </li>
      </ul>

      <div className="border-t border-white/[0.06] p-1.5">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            setisLoggedIn(false);
            navigate("/");
            toast.success("Logged out successfully");
            setnavtab(false);
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-red-400 hover:bg-red-500/10 transition-all duration-150 text-sm"
        >
          <LogOut size={"1rem"} />
          Log out
        </button>
      </div>
    </div>
  );
};

export default NavTab;
