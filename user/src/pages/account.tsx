import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const Account = () => {
  const navigate = useNavigate();
  const [confirmdelete, setconfirmdelete] = useState<boolean>(false);

  const fetchAccount = async () => {
    try {
      const res = await api.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/fetchAccount`
      );

      return res?.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    }
  };

  const deleteAccount = async () => {
    try {
      const res = await api.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/deleteAccount`
      );

      localStorage.removeItem("token");
      toast.success(res.data.message);
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    }
  };

  const { data: account, isLoading } = useQuery({
    queryKey: ["account"],
    queryFn: fetchAccount,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <>
      <div className="w-screen h-[7vh] sticky top-0 flex pl-2 pr-2 items-center gap-2 backdrop-blur-lg">
        {" "}
        <ChevronLeft
          onClick={() => navigate("/")}
          className="text-[rgba(255,255,255,0.5)] cursor-pointer"
          size={"1.2rem"}
        />
        <p className="text-[rgba(255,255,255,0.5)]">My Account</p>
        <div
          onClick={() => navigate("/")}
          className="shape bg-[rgba(255,255,255,0.5)] w-6 ml-auto"
        ></div>
      </div>

      <div className="w-screen lg:w-[50%] ml-[50%] translate-x-[-50%] min-h-screen flex flex-col p-5">
        {isLoading ? (
          <div className="inset-0 backdrop-blur-lg flex items-center justify-center">
            <div className="flex flex-row gap-2">
              <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-.5s]"></div>
            </div>
          </div>
        ) : (
          <>
            <img
              src="usericon.png"
              alt=""
              className="self-center lg:self-start w-30"
            />
            <p className="text-[rgba(255,255,255,0.5)] text-sm mt-3">Name</p>
            <p className="text-[rgba(255,255,255,0.8)] text-lg">
              {account?.name}
            </p>
            <p className="text-[rgba(255,255,255,0.5)] text-sm mt-3">Email</p>
            <p className="text-[rgba(255,255,255,0.8)] text-lg">
              {account?.email}
            </p>

            <div className="w-full rounded-md bg-[rgba(255,255,255,0.1)] flex justify-between items-center p-3 mt-5">
              <p className="text-[rgba(255,255,255,0.5)]">Delete Account</p>
              <button
                onClick={() => setconfirmdelete(true)}
                className="bg-red-900/30 text-red-500 rounded-md p-1 pl-2 pr-2"
              >
                Delete
              </button>
            </div>
          </>
        )}

        {confirmdelete ? (
          <>
            <div className="inset-0 fixed backdrop-blur-sm flex items-center justify-center z-40 ">
              {" "}
              <div className="p-5 rounded-md bg-[rgba(21,21,21)] w-[75%] lg:w-[50%] border-1 border-[rgba(255,255,255,0.2)] z-40 flex flex-col text-[rgba(255,255,255,0.8)] gap-1">
                <p>Are you sure you want to delete your account?</p>
                <p className="text-sm text-[rgba(255,255,255,0.5)]">
                  Deleting account will delete all your data including events
                  and everything
                </p>
                <button
                  onClick={() => deleteAccount()}
                  className="text-red-500 bg-red-900/30 cursor-pointer p-1 rounded-sm mt-2"
                >
                  Delete
                </button>
                <button
                  className="bg-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.7)] p-1 cursor-pointer rounded-sm mt-2"
                  onClick={() => setconfirmdelete(false)}
                >
                  Cancel
                </button>
              </div>{" "}
            </div>{" "}
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Account;
