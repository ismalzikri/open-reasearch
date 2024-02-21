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

  let video = useRef<HTMLVideoElement>();
  let stream = useRef<MediaStream | null>();
  let myCanvas = useRef(null);

  useEffect(() => {
    if (navigator.mediaDevices) startCamera();

    let timer = setInterval(() => {
      if (props.onColor && !props.paused) {
        props.onColor(getColorAt(video.current, 207, 368));
      }
    }, 375);

    return () => {
      clearInterval(timer);
    };
  }, [props.paused]);

  React.useEffect(() => {
    startCamera();
  }, [props.facingMode]);

  function getColorAt(webcam: any, x: number, y: number) {
    // To be able to access pixel data from the webcam feed, we must first draw the current frame in
    // a temporary canvas.
    var canvas = myCanvas.current as any;
    var context = canvas.getContext("2d");
    canvas.width = 414;
    canvas.height = 736;
    context.drawImage(webcam, 0, 0, 414, 736);

    // Then we grab the pixel information from the temp canvas and return it as an object
    var pixel = context.getImageData(x, y, 1, 1).data;
    return {
      r: pixel[0],
      g: pixel[1],
      b: pixel[2],
    };
  }

  const startCamera = () => {
    if (isCameraSwitching) return;
    setIsCameraSwitching(true);
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: props.facingMode,
          width: { min: 1024, ideal: 1280, max: 1920 },
          height: { min: 576, ideal: 720, max: 1080 },
        },
      })
      .then((feed) => {
        stream.current = feed;
        const videoRef = video.current as any;
        videoRef.srcObject = stream.current;
        videoRef.play();
        videoRef.onloadeddata = () => {
          setIsCameraSwitching(false);
        };
      })
      .catch(function (err) {
        console.log(err);
        setIsCameraSwitching(false);
      });
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
        //@ts-ignore
        ref={video}
        autoPlay={true}
        muted={true}
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
