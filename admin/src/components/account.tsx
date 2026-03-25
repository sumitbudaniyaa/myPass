import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type OutletContextType = {
  admin: any;
};

const Account = () => {
  const { admin } = useOutletContext<OutletContextType>();
  const navigate = useNavigate();
  const [isedit, setisedit] = useState<boolean>(false);

  const [name, setname] = useState<string>(admin?.name);
  const [email, setemail] = useState<string>(admin?.email);
  const [phone, setphone] = useState<string>(admin?.phone);
  const [saving, setsaving] = useState<boolean>(false);
  const [confirmdelete, setconfirmdelete] = useState<boolean>(false);

  const deleteAdmin = async () => {
    try {
      const res = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/eventRoute/deleteAdmin`,
        {
          adminid: admin?._id,
        }
      );

      toast.success(res.data.message);
      localStorage.removeItem("token");
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    }
  };

  const updateAdmin = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setsaving(true);

      const res = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/eventRoute/updateAdmin`,
        {
          adminid: admin?._id,
          name,
          email,
          phone,
        }
      );

      toast.success(res.data.message);
      setisedit(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    } finally {
      setsaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col p-3">
      <form className="w-full flex flex-col">
        <div className="mt-5 self-end">
          {isedit ? (
            <button
              onClick={(e) => updateAdmin(e)}
              className={`bg-green-900/30 text-green-500 ${
                saving
                  ? "opacity-50 pointer-events-none cursor-not-allowed"
                  : ""
              } rounded-md p-1 pl-2 text-sm pr-2`}
            >
              {saving ? "saving..." : "Save"}
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                setisedit(true);
              }}
              className="bg-white/10 text-[rgba(255,255,255,0.8)] text-sm rounded-md p-1 pl-2 pr-2"
            >
              Edit
            </button>
          )}
        </div>

        <p className="text-[rgba(255,255,255,0.5)] text-sm mt-3">Name</p>
        <p className="text-[rgba(255,255,255,0.8)] text-lg">
          {isedit ? (
            <input
              required
              type="text"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setname(e.target.value);
              }}
              className="outline-none p-1 w-full rounded-md border border-[rgba(255,255,255,0.2)]"
            />
          ) : (
            name
          )}
        </p>
        <p className="text-[rgba(255,255,255,0.5)] text-sm mt-3">Email</p>
        <p className="text-[rgba(255,255,255,0.8)] text-lg">
          {isedit ? (
            <input
              required
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setemail(e.target.value);
              }}
              className="outline-none p-1 w-full rounded-md border border-[rgba(255,255,255,0.2)]"
            />
          ) : (
            email
          )}
        </p>
        <p className="text-[rgba(255,255,255,0.5)] text-sm mt-3">Phone</p>
        <p className="text-[rgba(255,255,255,0.8)] text-lg">
          {isedit ? (
            <input
              type="tel"
              required
              value={phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setphone(e.target.value);
              }}
              className="outline-none p-1 w-full rounded-md border border-[rgba(255,255,255,0.2)]"
            />
          ) : (
            phone
          )}
        </p>
      </form>

      <div className="flex justify-between bg-white/10 rounded-lg items-center mt-10 p-3">
        <p className="text-[rgba(255,255,255,0.5)]">Delete Account</p>
        <button
          onClick={() => setconfirmdelete(true)}
          className="bg-red-900/30 text-red-500 p-1 pl-2 pr-2 rounded-sm"
        >
          Delete
        </button>
      </div>

      {confirmdelete ? (
        <>
          <div className="inset-0 fixed bg-black/20 backdrop-blur-sm flex items-center justify-center z-40 ">
            {" "}
            <div className="p-5 rounded-md bg-[rgba(21,21,21)] w-[75%] lg:w-[25%]  border-1 border-[rgba(255,255,255,0.2)] z-40 flex flex-col text-[rgba(255,255,255,0.8)] gap-1">
              <p>Are you sure you want to delete your account?</p>
              <p className="text-sm text-[rgba(255,255,255,0.5)]">
                Deleting account will delete all your data including events and
                everything
              </p>
              <button
                onClick={() => deleteAdmin()}
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
  );
};

export default Account;
