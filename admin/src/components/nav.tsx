import { LogOut, Ticket, Settings2, Wallet } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Nav = () => {
  const [selected, setselected] = useState<string>("events");
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Logged out successfully");
    localStorage.removeItem("token");
    navigate("/");
  };

  const navItems = [
    { name: "events", label: "Events", icon: <Ticket size="1rem" /> },
    { name: "payments", label: "Payments", icon: <Wallet size="1rem" /> },
    { name: "account", label: "Account", icon: <Settings2 size="1rem" /> },
  ];

  return (
    <div className="w-screen h-[7vh] flex items-center sticky top-0 backdrop-blur-lg px-3 gap-3 z-50 border-b border-white/[0.06]">
      <div className="flex items-center gap-1.5">
        <img src="/mypasslogo.png" className="w-6 h-6 object-contain" alt="myPass" />
        <p className="text-white/80 font-semibold text-sm tracking-wide">myPass</p>
      </div>

      <ul className="list-none flex gap-0.5 border-l border-white/10 pl-3">
        {navItems.map((item) => (
          <li
            key={item.name}
            onClick={() => { setselected(item.name); navigate(item.name); }}
            className={`flex items-center gap-1.5 text-sm cursor-pointer px-3 py-1.5 rounded-full transition-all duration-200 ${
              selected === item.name
                ? "bg-white/10 text-white/90"
                : "text-white/40 hover:text-white/70 hover:bg-white/[0.05]"
            }`}
          >
            {item.icon}
            <p className="hidden lg:block">{item.label}</p>
          </li>
        ))}
      </ul>

      <button
        onClick={handleLogout}
        className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-red-950/40 hover:bg-red-900/50 border border-red-800/30 rounded-full text-red-300 text-sm transition-all cursor-pointer"
      >
        <LogOut size={"0.9rem"} />
        <p className="hidden lg:block">Log out</p>
      </button>
    </div>
  );
};

export default Nav;
