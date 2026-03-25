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
    if (token) {
      setisLoggedIn(true);
    } else {
      setisLoggedIn(false);
    }
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
      <div className="pl-2 pr-2 mt-5 lg:w-[70%] lg:self-center">
        <h3 className="text-2xl font-semibold text-[rgba(255,255,255,0.8)]">
          Events Start Here!
        </h3>
        <p className="text-[rgba(255,255,255,0.5)]">
          All your events live, local, and online.
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
            className="inset-0 z-80 flex justify-center items-center backdrop-blur-sm bg-black/40 fixed"
          />
          <Login />
        </>
      )}

      {navtab ? (
        <NavTab setisLoggedIn={setisLoggedIn} setnavtab={setnavtab} />
      ) : (
        ""
      )}

      <EventSection
        selectedCategory={selectedCategory}
        searchText={searchText}
      />

      <Footer />
    </div>
  );
};

export default Home;
