import React, { useEffect, useRef, useState } from "react";

type CameraProps = {
  facingMode: boolean;
  onColor: Function;
  paused?: boolean;
};

export default function CameraColorPick(props: CameraProps) {
  const [isCameraSwitching, setIsCameraSwitching] = useState(false);

  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const myCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (navigator.mediaDevices) startCamera();

    const timer = setInterval(() => {
      if (props.onColor && !props.paused) {
        props.onColor(getColorAt(video.current, 207, 368));
      }
    }, 375);

    return () => {
      clearInterval(timer);
    };
  }, [props.paused]);

  useEffect(() => {
    startCamera();
    return () => stopCamera(); // Stop the camera when the component unmounts or facingMode changes
  }, [props.facingMode]);

  const getColorAt = (
    webcam: HTMLVideoElement | null,
    x: number,
    y: number
  ) => {
    if (!webcam) return null;

    const canvas = myCanvas.current;
    const context = canvas?.getContext("2d");
    if (canvas && context) {
      canvas.width = 414;
      canvas.height = 736;
      context.drawImage(webcam, 0, 0, 414, 736);
      const pixel = context.getImageData(x, y, 1, 1).data;
      return { r: pixel[0], g: pixel[1], b: pixel[2] };
    }
    return null;
  };

  const startCamera = () => {
    if (isCameraSwitching) return;
    setIsCameraSwitching(true);

    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: props.facingMode ? "user" : "environment",
          width: { min: 1024, ideal: 1280, max: 1920 },
          height: { min: 576, ideal: 720, max: 1080 },
        },
      })
      .then((feed) => {
        stopCamera(); // Stop any existing streams before starting a new one
        stream.current = feed;
        if (video.current) {
          video.current.srcObject = stream.current;
          video.current.play();
        }
        setIsCameraSwitching(false);
      })
      .catch((err) => {
        console.log(err);
        setIsCameraSwitching(false);
      });
  };

  const stopCamera = () => {
    if (stream.current) {
      stream.current.getTracks().forEach((track) => track.stop());
      stream.current = null;
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <canvas
        ref={myCanvas}
        style={{
          display: "none",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

      <video
        ref={video}
        autoPlay
        muted
        controls={false}
        preload="auto"
        playsInline
        style={{
          objectFit: "cover",
          objectPosition: "50% 50%",
          transition: isCameraSwitching ? "opacity 0.5s ease" : "none",
          opacity: isCameraSwitching ? 0 : 1,
        }}
      ></video>
    </div>
  );
}
