import ReactWebcam from "react-webcam";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { twMerge } from "tailwind-merge";
import { useEffect, useRef, useState } from "react";

type WebcamProperties = React.ComponentProps<typeof Modal> & {
  onCapture: (image: string) => void;
};

export function Webcam({
  onCapture,
  className,
  ...properties
}: WebcamProperties) {
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState<string>();

  const webcamRef = useRef<ReactWebcam>(null);

  useEffect(() => {
    (async () => {
      if (properties.open) {
        setDevices(await navigator.mediaDevices.enumerateDevices());
      } else {
        setLoading(false);
      }
    })();
  }, [properties.open]);

  const onClick = () => {
    if (webcamRef.current) {
      const image = webcamRef.current.getScreenshot();

      if (image) {
        setLoading(true);
        onCapture(image);
      }
    }
  };

  return (
    <Modal
      className={twMerge("flex flex-col space-y-4", className)}
      {...properties}
    >
      <ReactWebcam
        key={deviceId}
        className="w-full aspect-square object-cover rounded-xl bg-zinc-100"
        mirrored
        audio={false}
        videoConstraints={{
          width: 1024,
          height: 1024,
          ...(deviceId
            ? {
                deviceId,
              }
            : {
                facingMode: "user",
              }),
        }}
        ref={webcamRef}
      />
      <Button onClick={onClick} loading={loading}>
        Capture
      </Button>
    </Modal>
  );
}
