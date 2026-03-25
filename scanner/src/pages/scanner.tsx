import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import QrScanner from "@/components/qrscanner";
import api from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";

const ScanPage = () => {
  const navigate = useNavigate();

  const handleScan = async (qrText: string) => {
    try {
      const res = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/scannerRoute/scanTicket`,
        { qrText }
      );

      toast.success(res.data.message || "Scan successful");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Scan failed";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col">
      <Toaster position="bottom-center" />

      <div className="w-screen h-[7vh] flex items-center justify-between sticky top-0 backdrop-blur-lg pl-2 p-1 pr-2 gap-3 z-50">
        <p
          onClick={() => navigate("/home")}
          className="text-[rgba(255,255,255,0.4)] text-sm flex items-center cursor-pointer"
        >
          <ChevronLeft size={"1rem"} /> back
        </p>
        <div className="shape bg-[rgba(255,255,255,0.5)] w-6"></div>
      </div>

      <QrScanner onScanSuccess={handleScan} />
    </div>
  );
};

export default ScanPage;
