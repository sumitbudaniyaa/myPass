import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { User, Mail, Phone, Pencil, Check, X } from "lucide-react";

type OutletContextType = {
  admin: any;
};

const inputClass =
  "w-full bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2.5 text-white/80 text-sm outline-none placeholder:text-white/25 focus:border-white/20 transition-colors";

const Account = () => {
  const { admin } = useOutletContext<OutletContextType>();
  const navigate = useNavigate();
  const [isedit, setisedit] = useState<boolean>(false);
  const [name, setname] = useState<string>(admin?.name);
  const [email, setemail] = useState<string>(admin?.email);
  const [phone, setphone] = useState<string>(admin?.phone);
  const [saving, setsaving] = useState<boolean>(false);
  const [confirmdelete, setconfirmdelete] = useState<boolean>(false);

  const cancelEdit = () => {
    setname(admin?.name);
    setemail(admin?.email);
    setphone(admin?.phone);
    setisedit(false);
  };

  const deleteAdmin = async () => {
    try {
      const res = await api.post(`${import.meta.env.VITE_BACKEND_URL}/api/eventRoute/deleteAdmin`, {
        adminid: admin?._id,
      });
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
      const res = await api.post(`${import.meta.env.VITE_BACKEND_URL}/api/eventRoute/updateAdmin`, {
        adminid: admin?._id,
        name,
        email,
        phone,
      });
      toast.success(res.data.message);
      setisedit(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    } finally {
      setsaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen p-4 lg:p-5">
      {/* Profile Info Card */}
      <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 border-b border-white/[0.07]">
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Profile</p>
          {!isedit ? (
            <button
              onClick={() => setisedit(true)}
              className="flex items-center gap-1.5 text-white/45 hover:text-white/70 text-xs transition-colors cursor-pointer"
            >
              <Pencil size="0.75rem" /> Edit
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={cancelEdit}
                className="flex items-center gap-1 text-white/35 hover:text-white/60 text-xs transition-colors cursor-pointer"
              >
                <X size="0.75rem" /> Cancel
              </button>
            </div>
          )}
        </div>

        <form onSubmit={updateAdmin} className="divide-y divide-white/[0.06]">
          {/* Name */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-3">
              <User size="0.85rem" className="text-white/25 shrink-0" />
              <div className="flex-1">
                <p className="text-white/35 text-xs mb-1">Full name</p>
                {isedit ? (
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                    className={inputClass}
                    autoFocus
                  />
                ) : (
                  <p className="text-white/85 text-sm">{name}</p>
                )}
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-3">
              <Mail size="0.85rem" className="text-white/25 shrink-0" />
              <div className="flex-1">
                <p className="text-white/35 text-xs mb-1">Email address</p>
                {isedit ? (
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    className={inputClass}
                  />
                ) : (
                  <p className="text-white/85 text-sm">{email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-3">
              <Phone size="0.85rem" className="text-white/25 shrink-0" />
              <div className="flex-1">
                <p className="text-white/35 text-xs mb-1">Phone number</p>
                {isedit ? (
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setphone(e.target.value)}
                    className={inputClass}
                  />
                ) : (
                  <p className="text-white/85 text-sm">{phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Save button - only in edit mode */}
          {isedit && (
            <div className="px-4 py-3">
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white/80 text-sm font-medium rounded-xl cursor-pointer transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {saving ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
                ) : (
                  <>
                    <Check size="0.85rem" /> Save changes
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Danger Zone */}
      <div className="mt-5 bg-red-950/20 border border-red-700/20 rounded-2xl p-4 flex justify-between items-center">
        <div>
          <p className="text-white/60 text-sm font-medium">Delete Account</p>
          <p className="text-white/30 text-xs mt-0.5">Removes all events, bookings, and data</p>
        </div>
        <button
          onClick={() => setconfirmdelete(true)}
          className="bg-red-950/60 border border-red-700/30 text-red-400 text-sm px-4 py-1.5 rounded-full cursor-pointer hover:bg-red-950/80 transition-all"
        >
          Delete
        </button>
      </div>

      {/* Confirm Delete Modal */}
      {confirmdelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-[90%] max-w-sm flex flex-col gap-4 shadow-2xl">
            <div>
              <p className="text-white/85 font-semibold">Delete account?</p>
              <p className="text-white/40 text-sm mt-1">
                This will permanently delete your account, all events, bookings, and data. This cannot be undone.
              </p>
            </div>
            <button
              onClick={deleteAdmin}
              className="w-full bg-red-950/60 border border-red-700/30 text-red-400 py-2.5 rounded-xl text-sm font-medium cursor-pointer hover:bg-red-950/80 transition-all"
            >
              Delete my account
            </button>
            <button
              onClick={() => setconfirmdelete(false)}
              className="w-full bg-white/[0.06] border border-white/10 text-white/60 py-2.5 rounded-xl text-sm cursor-pointer hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
