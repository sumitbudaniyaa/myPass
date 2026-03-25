import { Tickets } from "lucide-react";
import { Settings2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type NavTabProps = {
  setisLoggedIn: (value: boolean) => void;
  setnavtab: (value: boolean) => void;
};

const NavTab = ({ setisLoggedIn, setnavtab }: NavTabProps) => {
  const navigate = useNavigate();

  return (
    <div className="p-3 w-50 flex flex-col items-center shadow-sm border-1 border-[rgba(255,255,255,0.2)] lg:w-70 sm:w-60 md:w-65 fixed right-1 bg-[rgba(21,21,21)] top-15 z-70 rounded-lg gap-2">
      <ul className="list-none w-[100%] flex flex-col gap-2 text-[rgba(255,255,255,0.5)]">
        <li
          onClick={() => navigate("/my-bookings")}
          className="bg-neutral-900 p-2 rounded-sm flex items-center gap-2 cursor-pointer"
        >
          {" "}
          <Tickets size={"1.2rem"} /> My Bookings
        </li>
        <li
          onClick={() => navigate("/account")}
          className="bg-neutral-900 p-2 rounded-sm flex items-center gap-2 cursor-pointer"
        >
          {" "}
          <Settings2 size={"1.2rem"} />
          Account
        </li>
      </ul>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          setisLoggedIn(false);
          navigate("/");
          toast.success("Logged Out successfully");
          setnavtab(false);
        }}
        className="bg-red-500 cursor-pointer w-[100%] p-1 text-sm rounded-md text-red-100"
      >
        Log out
      </button>
    </div>
  );
};

export default NavTab;
