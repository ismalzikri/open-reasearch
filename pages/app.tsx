import { useState } from "react";
import type { NextPage } from "next";
import { Toaster } from "sonner";
import { getColorName, rgbToHex } from "../src/utils";
import { useTranslation } from "../src/context/TranslationContext";
import Head from "next/head";
import Image from "next/image";
import axios from "axios";
import CameraColorPick from "../src/components/Camera";

const App: NextPage = () => {
  const [color, setColor] = useState("#888888");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isFacingMode, setIsFacingMode] = useState(false);

  const { translatedColors, renderText } = useTranslation();

  const handleCameraSwitch = () => {
    // Toggle the isFacingMode between user and environment
    setIsFacingMode((prevMode) => !prevMode);
  };

  const ttsUrl = `${process.env.URL_TEXTTOSPEECH}/speak`;

  const speakText = async (text: string, targetLanguage: string) => {
    try {
      // Make a POST request to the gTTS-based API
      const response = await axios.post(
        ttsUrl,
        {
          text: text,
          lang: targetLanguage,
        },
        {
          responseType: "blob", // Set response type to blob to handle binary data
        }
      );

      // Create a URL for the audio blob
      const audioUrl = URL.createObjectURL(response.data);
      const audio = new Audio(audioUrl);

      // Play the audio
      audio.play();

      // Cleanup after the audio finishes playing
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
    } catch (error) {
      console.error("Failed to fetch audio from TTS API:", error);
    }
  };

  const closestColorName = getColorName(color, translatedColors);

  const whatColor = async () => {
    if (isSpeaking) {
      return;
    }

    const result = closestColorName;
    const speechSentence = `${renderText} ${result}`;

    const targetLanguage =
      navigator.language === "id-ID" ? "id" : navigator.language;

    setIsSpeaking(true);
    await speakText(speechSentence, targetLanguage);
    setIsSpeaking(false);
  };

  const renderApp = () => {
    return (
      <>
        <div className="lg:max-w-sm mx-auto flex flex-1 justify-center items-center bg-black h-screen">
          <div className="w-full flex items-center">
            <CameraColorPick
              facingMode={isFacingMode}
              onColor={(value: any) => {
                setColor(rgbToHex(value.r, value.g, value.b).toUpperCase());
              }}
            />
          </div>
        </div>
        <div
          className="absolute top-0 left-0 w-full flex justify-center items-center"
          style={{ height: "100%" }}
        >
          <div
            className="width-[1px] height-[1px] rounded-full relative flex justify-center items-center"
            style={{ background: color }}
          >
            <div className="absolute -top-16 p-3 rounded-md backdrop-blur-xl bg-black/30 text-white font-semibold shadow-black/90 shadow-xl flex items-center gap-3 border border-white/10 ring-1 ring-black/70">
              <div className="w-full">
                <div
                  className="w-8 h-8 rounded-full border border-white/20 ring-1 ring-black/40"
                  style={{ background: color }}
                ></div>
              </div>
              <div className="w-full whitespace-nowrap">{closestColorName}</div>
            </div>
            <div className="w-0 h-0 absolute top-[-6px] border-l-[10px] border-l-transparent border-t-[10px] border-t-white/30 border-r-[10px] border-r-transparent shadow-black/90 shadow-xl"></div>
            <div className="fixed z-10 bottom-4 xs:bottom-6 w-full lg:max-w-sm px-7 flex items-center justify-between">
              <button className="w-12 h-12 rounded-full backdrop-blur-xl bg-black/30 flex items-center justify-center select-none">
                <span className="sr-only">Microphone button</span>
                <Image
                  src="/icons/microphone-mute.png"
                  width={30}
                  height={30}
                  alt="Microphone icon"
                />
              </button>
              <button
                className="w-20 h-20 border-[5px] border-[#fff] flex justify-center items-center rounded-full select-none"
                onClick={() => whatColor()}
              >
                <div className="w-16 h-16 bg-white rounded-full select-none"></div>
              </button>
              <button
                onClick={handleCameraSwitch}
                className="w-12 h-12 rounded-full backdrop-blur-xl bg-black/30 flex items-center justify-center select-none"
              >
                <span className="sr-only">Switch camera icon</span>
                <Image
                  src="/icons/camera-icon-switch.png"
                  width={30}
                  height={30}
                  alt="Switch camera icon"
                />
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="w-full">
      <Head>
        <title>Color Assistant | Helping blind people</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {renderApp()}
      <Toaster />
    </div>
  );
};

export default App;
