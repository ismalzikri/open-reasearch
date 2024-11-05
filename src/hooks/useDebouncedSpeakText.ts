import { useState, useCallback } from "react";
import axios from "axios";

const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const getCacheKey = (text: string, lang: string) => `${text}-${lang}`;

const cleanupCache = () => {
  const now = Date.now();
  Object.keys(localStorage).forEach((key) => {
    const cachedItem = JSON.parse(localStorage.getItem(key) || "{}");
    if (now - cachedItem.timestamp > CACHE_EXPIRATION) {
      localStorage.removeItem(key);
    }
  });
};

export const useDebouncedSpeakText = (ttsUrl: string) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  cleanupCache();

  const debouncedSpeakText = useCallback(
    async (text: string, lang: string) => {
      if (isSpeaking) return;

      const cacheKey = getCacheKey(text, lang);
      const cachedItem = localStorage.getItem(cacheKey);

      if (cachedItem) {
        const { audioUrl } = JSON.parse(cachedItem);
        const audio = new Audio(audioUrl);

        setIsSpeaking(true);
        audio.play();
        audio.onended = () => setIsSpeaking(false);
        return;
      }

      setIsSpeaking(true);
      try {
        const response = await axios.post(
          ttsUrl,
          { text, lang },
          { responseType: "blob" }
        );

        const audioUrl = URL.createObjectURL(response.data);
        const audio = new Audio(audioUrl);

        // Play the audio
        audio.play();
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          setIsSpeaking(false);
        };

        // Cache the audio URL with a timestamp
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ audioUrl, timestamp: Date.now() })
        );
      } catch (error) {
        console.error("Error during TTS request:", error);
        setIsSpeaking(false);
      }
    },
    [isSpeaking, ttsUrl]
  );

  return debouncedSpeakText;
};
