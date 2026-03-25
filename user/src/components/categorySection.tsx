import CatCard from "./catCard";
import { Music } from "lucide-react";
import { Slack } from "lucide-react";
import { Handshake } from "lucide-react";
import { Theater } from "lucide-react";
import { School } from "lucide-react";
import { Cpu } from "lucide-react";

type CatSectionProp = {
  setselectedCategory: (value: string) => void;
  selectedCategory: string;
};

const CatSection = ({
  setselectedCategory,
  selectedCategory,
}: CatSectionProp) => {
  const categories = [
    {
      label: "All",
      name: "all",
      icon: <Slack size={"1.2rem"} />,
    },
    {
      label: "Music",
      name: "music",
      icon: <Music size={"1.2rem"} />,
    },
    {
      label: "Social",
      name: "social",
      icon: <Handshake size={"1.2rem"} />,
    },
    {
      label: "College",
      name: "college",
      icon: <School size={"1.2rem"} />,
    },
    {
      label: "Theater",
      name: "theater",
      icon: <Theater size={"1.2rem"} />,
    },
    {
      label: "Tech",
      name: "tech",
      icon: <Cpu size={"1.2rem"} />,
    },
  ];

  return (
    <div className="w-100% lg:w-[70%] lg:self-center pl-2 pr-2 mt-5 flex items-center gap-2 overflow-auto">
      {categories.map((category, index) => (
        <CatCard
          key={index}
          selectedCategory={selectedCategory}
          category={category}
          setselectedCategory={setselectedCategory}
        />
      ))}
    </div>
  );
};

export default CatSection;
