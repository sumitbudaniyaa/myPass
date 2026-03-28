import CatCard from "./catCard";
import { Music, Slack, Handshake, Theater, School, Cpu } from "lucide-react";

type CatSectionProp = {
  setselectedCategory: (value: string) => void;
  selectedCategory: string;
};

const CatSection = ({ setselectedCategory, selectedCategory }: CatSectionProp) => {
  const categories = [
    { label: "All", name: "all", icon: <Slack size={"1rem"} /> },
    { label: "Music", name: "music", icon: <Music size={"1rem"} /> },
    { label: "Social", name: "social", icon: <Handshake size={"1rem"} /> },
    { label: "College", name: "college", icon: <School size={"1rem"} /> },
    { label: "Theater", name: "theater", icon: <Theater size={"1rem"} /> },
    { label: "Tech", name: "tech", icon: <Cpu size={"1rem"} /> },
  ];

  return (
    <div className="w-full lg:w-[70%] lg:self-center px-3 mt-4 flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
