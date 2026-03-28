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
  const isActive = selectedCategory === category.name;

  return (
    <div
      onClick={() => setselectedCategory(category.name)}
      className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-pointer text-sm transition-all duration-200 ${
        isActive
          ? "bg-white text-black font-medium shadow-md"
          : "bg-white/[0.08] text-white/60 hover:bg-white/[0.12] hover:text-white/80 border border-white/10"
      }`}
    >
      {category.icon}
      <p>{category.label}</p>
    </div>
  );
};

export default CatCard;
