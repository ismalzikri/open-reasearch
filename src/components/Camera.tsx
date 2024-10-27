import React, { useEffect, useRef, useState } from "react";

export enum FacingMode {
  user = "user",
  environment = "environment",
}

type CameraProps = {
  facingMode: FacingMode;
  onColor: Function;
  paused?: boolean;
};

export default function CameraColorPick(props: CameraProps) {
  const [isCameraSwitching, setIsCameraSwitching] = useState(false);

  let video = useRef<HTMLVideoElement>(null);
  let stream = useRef<MediaStream | null>(null);
  let myCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (navigator.mediaDevices) startCamera();

    const timer = setInterval(() => {
      if (props.onColor && !props.paused) {
        props.onColor(getColorAt(video.current, 207, 368));
      }
    }, 375);

    return () => {
      clearInterval(timer);
      stopCamera(); // Clean up the camera stream when the component unmounts
    };
  }, [props.paused]);

  useEffect(() => {
    startCamera(); // Restart camera when facingMode changes
    return stopCamera; // Stop camera on component unmount or facingMode change
  }, [props.facingMode]);

  function getColorAt(webcam: HTMLVideoElement | null, x: number, y: number) {
    const canvas = myCanvas.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || !webcam) return { r: 0, g: 0, b: 0 };

    canvas.width = 414;
    canvas.height = 736;
    context.drawImage(webcam, 0, 0, 414, 736);
    const pixel = context.getImageData(x, y, 1, 1).data;
    return { r: pixel[0], g: pixel[1], b: pixel[2] };
  }

  const startCamera = async (retryCount = 0) => {
    if (isCameraSwitching) return;
    setIsCameraSwitching(true);

    // Stop the current stream if active
    stopCamera();

    try {
      // Delay to ensure the previous camera is fully released
      await new Promise((resolve) => setTimeout(resolve, 200));

      const feed = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: props.facingMode,
          width: { min: 1024, ideal: 1280, max: 1920 },
          height: { min: 576, ideal: 720, max: 1080 },
        },
      });

      stream.current = feed;
      if (video.current) {
        video.current.srcObject = stream.current;
        video.current.play();
      }
      setIsCameraSwitching(false);
    } catch (err) {
      console.error("Error accessing camera:", err);
      if (retryCount < 2) {
        // Retry up to 2 times to switch the camera
        setTimeout(() => startCamera(retryCount + 1), 500);
      } else {
        setIsCameraSwitching(false);
      }
    }
  };

  const stopCamera = () => {
    if (stream.current) {
      stream.current.getTracks().forEach((track) => track.stop());
      stream.current = null;
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <canvas ref={myCanvas} style={{ display: "none" }} />

      <video
        ref={video}
        autoPlay
        muted
        playsInline
        style={{
          objectFit: "cover",
          opacity: isCameraSwitching ? 0 : 1,
          transition: "opacity 0.5s ease",
        }}
      />
    </div>
  );
}
