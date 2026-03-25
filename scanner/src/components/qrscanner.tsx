import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import toast from "react-hot-toast";

const QrScanner = ({ onScanSuccess }: any) => {
  const lastScannedRef = useRef("");
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("qr-reader");
    html5QrCodeRef.current = html5QrCode;

    Html5Qrcode.getCameras().then((devices) => {
      if (devices && devices.length) {
        const backCamera = devices.find((device) =>
          device.label.toLowerCase().includes("back")
        );
        const cameraId = backCamera?.id || devices[0].id;

        html5QrCode
          .start(
            cameraId,
            { fps: 10, qrbox: { width: 300, height: 300 } },
            (decodedText) => {
              if (decodedText !== lastScannedRef.current) {
                lastScannedRef.current = decodedText;

                onScanSuccess(decodedText);

                setTimeout(() => {
                  lastScannedRef.current = "";
                }, 3000);
              }
            },
            (errorMessage) => {
              console.log(errorMessage);
            }
          )
          .catch((err) => {
            toast.error("Unable to start camera");
            console.error("Camera start error:", err);
          });
      }
    });

    return () => {
      html5QrCode
        .stop()
        .then(() => html5QrCode.clear())
        .catch(() => {});
    };
  }, []);

  return (
    <div className="w-full flex flex-col gap-2 items-center">
      <h2 className="text-white/70 text-lg">Scan QR Code</h2>
      <div
        id="qr-reader"
        className="rounded-md"
        style={{ width: "300px" }}
      ></div>
    </div>
  );
};

export default QrScanner;
