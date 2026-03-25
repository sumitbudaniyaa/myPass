type CatCardProp = {
  category: any;
  selectedCategory: string;
  setselectedCategory: (value: string) => void;
};

const CatCard = ({
  category,
  selectedCategory,
  setselectedCategory,
}: CatCardProp) => {
  return (
    <div
      onClick={() => setselectedCategory(category.name)}
      className={`bg-[rgba(255,255,255,0.1)] rounded-sm cursor-pointer flex items-center gap-1.5 justify-center p-2 text-[rgba(255,255,255,0.8)] ${
        selectedCategory === category.name
          ? "bg-[rgba(255,255,255,0.8)] text-black"
          : ""
      }`}
    >
      {category.icon}
      <p className="text-sm">{category.label}</p>
    </div>
  );
};
export default CatCard;
