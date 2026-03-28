import CatSection from "@/components/categorySection";
import EventSection from "@/components/eventsection";
import Footer from "@/components/footer";
import Login from "@/components/login";
import Nav from "@/components/nav";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import NavTab from "../components/navtab";

const Home = () => {
  const [isLoggedIn, setisLoggedIn] = useState<boolean>(false);
  const [isLogInOpen, setisLogInOpen] = useState<boolean>(false);
  const [selectedCategory, setselectedCategory] = useState<string>("all");
  const [searchText, setsearchText] = useState<string>("");
  const [navtab, setnavtab] = useState<boolean>(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    setisLoggedIn(!!token);
  }, [token]);

  return (
    <div className="w-screen min-h-screen flex flex-col">
      <Toaster position="top-center" />

      <Nav
        setisLogInOpen={setisLogInOpen}
        isLoggedIn={isLoggedIn}
        setsearchText={setsearchText}
        setnavtab={setnavtab}
        navtab={navtab}
      />

      {/* Hero */}
      <div className="px-3 mt-7 lg:w-[70%] lg:self-center">
        <h1 className="text-3xl font-bold text-white/90 leading-tight">
          Find your next <span className="text-white/50">experience</span>
        </h1>
        <p className="text-white/35 text-sm mt-1.5">
          Concerts, college fests, meetups — discover events near you.
        </p>
      </div>

      <CatSection
        setselectedCategory={setselectedCategory}
        selectedCategory={selectedCategory}
      />

      {isLogInOpen && (
        <>
          <div
            onClick={() => setisLogInOpen(false)}
            className="inset-0 z-[80] flex justify-center items-center backdrop-blur-sm bg-black/50 fixed"
          />
          <Login />
        </>
      )}

      {navtab && (
        <NavTab setisLoggedIn={setisLoggedIn} setnavtab={setnavtab} />
      )}

      <EventSection selectedCategory={selectedCategory} searchText={searchText} />

      <Footer />
    </div>
  );
};

export default Home;
