import { AuroraText } from "@/components/magicui/aurora-text";
import { Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full lg:w-[70%] lg:self-center mt-10 flex flex-col items-center border-t border-white/[0.06] px-3 pt-4 pb-3 gap-3">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-1.5">
          <img src="/mypasslogo.png" className="w-4 h-4 object-contain opacity-50" alt="myPass" />
          <p className="text-white/40 text-xs">myPass</p>
        </div>
        <a href="https://instagram.com/mypass.live" target="_blank">
          <Instagram
            size={"1.1rem"}
            className="text-white/25 hover:text-white/70 cursor-pointer transition-all duration-300"
          />
        </a>
      </div>
      <a href="https://admin.mypass.live" target="_blank">
        <AuroraText className="text-xs cursor-pointer">Host your own events</AuroraText>
      </a>
    </footer>
  );
};

export default Footer;
