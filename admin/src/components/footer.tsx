import { AuroraText } from "@/components/magicui/aurora-text";
import { Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full mt-10 flex flex-col items-center border-t border-white/[0.06] p-3 gap-3 mb-2">
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
      <a href="https://mypass.live" target="_blank">
        <AuroraText className="text-xs cursor-pointer">Explore events</AuroraText>
      </a>
    </footer>
  );
};

export default Footer;
