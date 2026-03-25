import { LogOut } from "lucide-react";
import { Ticket } from "lucide-react";
import { useState } from "react";
import { Settings2 } from "lucide-react";
import { Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Nav = () => {
  const [selected, setselected] = useState<string>("events");
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Logged Out successfully");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="w-screen h-[7vh] flex items-center sticky top-0 backdrop-blur-lg pl-2 p-1 pr-2 gap-3 z-50">
      <div className="flex items-center gap-1">
        <div className="shape bg-[rgba(255,255,255,0.5)] w-6"></div>
        <p className="text-[rgba(255,255,255,0.5)]">myPass</p>
      </div>

      <ul className="list-none flex gap-1 border-l-1 border-[rgba(255,255,255,0.2)] pl-1">
        {[
          {
            name: "events",
            label: "Events",
            icon: <Ticket size="1.1rem" />,
          },
          {
            name: "payments",
            label: "Payments",
            icon: <Wallet size="1.1rem" />,
          },
          {
            name: "account",
            label: "Account",
            icon: <Settings2 size="1.1rem" />,
          },
        ].map((item) => (
          <li
            key={item.name}
            onClick={() => {
              setselected(item.name);
              navigate(item.name);
            }}
            className={`text-[rgba(255,255,255,0.5)] flex items-center gap-1 text-sm font-medium cursor-pointer p-2 rounded-sm ${
              selected === item.name ? "text-[rgba(255,255,255,0.8)]" : ""
            }`}
          >
            {item.icon}
            <p className="hidden lg:block">{item.label}</p>
          </li>
        ))}
      </ul>

      <div
        onClick={handleLogout}
        className="p-1.5 ml-auto cursor-pointer bg-red-500/30  rounded-md flex justify-center items-center gap-1"
      >
        <p className="hidden lg:block text-sm text-[rgba(255,255,255,0.8)]">
          LogOut
        </p>{" "}
        <LogOut size={"1.1rem"} className="text-[rgba(255,255,255,0.8)]" />
      </div>
    </div>
  );
};

export default Nav;
