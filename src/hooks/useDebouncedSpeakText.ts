import { useState, useCallback } from "react";
import axios from "axios";

export const useDebouncedSpeakText = (ttsUrl: string) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const debouncedSpeakText = useCallback(
    async (text: string, lang: string) => {
      if (isSpeaking) return;

      setIsSpeaking(true);
      try {
        const response = await axios.post(
          ttsUrl,
          { text, lang },
          { responseType: "blob" }
        );

        const audio = new Audio();
        audio.src = URL.createObjectURL(response.data);

        audio.play();
        audio.onended = () => {
          URL.revokeObjectURL(audio.src);
          setIsSpeaking(false);
        };
      } catch (error) {
        console.error("Error during TTS request:", error);
        setIsSpeaking(false);
      }
    },
    [isSpeaking, ttsUrl]
  );

  return debouncedSpeakText;
};
