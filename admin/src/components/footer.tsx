import { AuroraText } from "@/components/magicui/aurora-text";
import { Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-[100%] mt-10 flex flex-col items-center lg:self-center border-t-1 border-[rgba(255,255,255,.2)] p-2 gap-3 mb-2">
      <div className="flex justify-between items-center w-[100%]">
        <div className="flex items-center gap-1">
          <div className="shape bg-[rgba(255,255,255,0.5)] w-4"></div>
          <p className="text-[rgba(255,255,255,0.5)] text-sm">myPass</p>
        </div>

        <div>
          <a href="https://instagram.com/mypass.live" target="_blank">
            <Instagram
              size={"1.3rem"}
              className="text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.8)] cursor-pointer tranition-all duration-300"
            />
          </a>
        </div>
      </div>

      <a href="https://mypass.live" target="_blank">
        <AuroraText className="text-sm cursor-pointer">
          Explore events
        </AuroraText>
      </a>
    </footer>
  );
};

export default Footer;
