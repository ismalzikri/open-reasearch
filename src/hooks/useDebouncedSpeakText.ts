import { useState, useCallback, useRef } from "react";
import axios from "axios";

export const useDebouncedSpeakText = (ttsUrl: string) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioCache = useRef<Map<string, string>>(new Map());

  const debouncedSpeakText = useCallback(
    async (text: string, lang: string) => {
      if (isSpeaking) return;

      const cacheKey = `${text}-${lang}`;
      let audioUrl = audioCache.current.get(cacheKey);

      if (!audioUrl) {
        try {
          setIsSpeaking(true);
          const response = await axios.post(
            ttsUrl,
            { text, lang },
            { responseType: "blob" }
          );

          audioUrl = URL.createObjectURL(response.data);
          audioCache.current.set(cacheKey, audioUrl); // Cache the audio URL
        } catch (error) {
          console.error("Error during TTS request:", error);
          setIsSpeaking(false);
          return;
        }
      }

      const audio = new Audio(audioUrl);
      audio.play();
      audio.onended = () => {
        if (audioUrl) URL.revokeObjectURL(audioUrl); // Clean up if necessary
        setIsSpeaking(false);
      };
    },
    [isSpeaking, ttsUrl]
  );

  return debouncedSpeakText;
};
