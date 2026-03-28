import { Search } from "lucide-react";

type NavProps = {
  setisLogInOpen: (value: boolean) => void;
  isLoggedIn: any;
  setsearchText: (value: string) => void;
  setnavtab: (value: boolean) => void;
  navtab: boolean;
};

const Nav = ({
  setisLogInOpen,
  isLoggedIn,
  setsearchText,
  setnavtab,
  navtab,
}: NavProps) => {
  return (
    <div className="w-full h-[7vh] sticky top-0 flex items-center backdrop-blur-lg justify-between px-3 lg:px-5 z-50 border-b border-white/[0.06]">
      <div className="flex items-center gap-1.5">
        <img src="/mypasslogo.png" className="w-6 h-6 object-contain" alt="myPass" />
        <p className="text-white/80 font-semibold text-sm tracking-wide">myPass</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <Search size={"0.85rem"} className="absolute right-2.5 text-white/30 pointer-events-none" />
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setsearchText(e.target.value)}
            className="bg-white/[0.07] h-8 w-36 lg:w-48 pl-3 pr-7 text-xs text-white/80 border border-white/10 rounded-full outline-none placeholder:text-white/30 focus:border-white/20 transition-colors"
            type="text"
            placeholder="Search event"
          />
        </div>

        {isLoggedIn ? (
          <img
            src="/usericon.png"
            className="w-7 h-7 rounded-full cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
            alt=""
            onClick={() => setnavtab(!navtab)}
          />
        ) : (
          <button
            onClick={() => setisLogInOpen(true)}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white/80 text-xs rounded-full transition-all duration-200"
          >
            Log In
          </button>
        )}
      </div>
    </div>
  );
};

export default Nav;
