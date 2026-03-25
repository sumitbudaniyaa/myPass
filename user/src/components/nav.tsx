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
    <div
      className={`w-full h-[7vh] sticky top-0 flex items-center backdrop-blur-lg justify-between pl-2 pr-2 lg:pl-4 lg:pr-4 z-50 transition-all duration-300 
      `}
    >
      <div className="flex items-center gap-1">
        <div className="shape bg-[rgba(255,255,255,0.5)] w-6"></div>
        <p className="text-[rgba(255,255,255,0.5)]">myPass</p>
      </div>
      <div className="flex items-center gap-2.5 lg:gap-4">
        <div className="w-40 lg:w-50 h-[100%] relative flex items-center">
          <Search
            size={"1rem"}
            className="absolute right-1 text-[rgba(255,255,255,0.4)]"
          />{" "}
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setsearchText(e.target.value);
            }}
            className="bg-[rgba(255,255,255,0.1)] p-1 font-light h-[100%] text-[rgba(255,255,255,0.8)] border-1 border-[rgba(255,255,255,0.2)] pl-2 text-base outline-none w-[100%] rounded-md"
            type="text"
            placeholder="Search event"
          />
        </div>

        {isLoggedIn ? (
          <img
            src="/usericon.png"
            className="w-8 cursor-pointer"
            alt=""
            onClick={() => setnavtab(!navtab)}
          />
        ) : (
          <button
            onClick={() => setisLogInOpen(true)}
            className="p-1.5 pl-2 pr-2 bg-[rgba(255,255,255,0.2)] text-[rgba(255,255,255,0.8)] text-sm rounded-md"
          >
            Log In
          </button>
        )}
      </div>
    </div>
  );
};

export default Nav;
