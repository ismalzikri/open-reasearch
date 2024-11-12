import { useState, useCallback } from "react";
import axios from "axios";

// Helper function to convert Base64 string to a Blob
function base64ToBlob(base64: string, mimeType = "audio/mp3"): Blob {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes.buffer], { type: mimeType });
}

export const useDebouncedSpeakText = (ttsUrl: string, cacheSize = 100) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [cache, setCache] = useState<Map<string, Blob>>(new Map());

  const debouncedSpeakText = useCallback(
    async (text: string, lang: string) => {
      if (isSpeaking) return;

      const cacheKey = `${text}-${lang}`;
      setIsSpeaking(true);

      try {
        let audioBlob = cache.get(cacheKey);

        // Fetch from API if not cached
        if (!audioBlob) {
          const response = await axios.post(
            ttsUrl,
            { text, lang },
            { responseType: "json" }
          );
          const base64Audio = response.data.audio;
          if (base64Audio) {
            audioBlob = base64ToBlob(base64Audio);
            setCache((prevCache) => {
              const newCache = new Map(prevCache);
              newCache.set(cacheKey, audioBlob!);
              if (newCache.size > cacheSize) {
                const firstKey = newCache.keys().next().value;
                if (firstKey !== undefined) {
                  newCache.delete(firstKey);
                }
              }
              return newCache;
            });
          }
        }

        // Check if audioBlob is defined
        if (audioBlob) {
          const audioURL = URL.createObjectURL(audioBlob);
          const audioContext = new (window.AudioContext ||
            (window as any).webkitAudioContext)();
          const response = await fetch(audioURL);
          const arrayBuffer = await response.arrayBuffer();
          const decodedAudio = await audioContext.decodeAudioData(arrayBuffer);
          const source = audioContext.createBufferSource();
          source.buffer = decodedAudio;
          source.connect(audioContext.destination);
          source.start(0);

          source.onended = () => {
            setIsSpeaking(false);
            URL.revokeObjectURL(audioURL); // Clean up Blob URL
            audioContext.close();
          };
        } else {
          console.error("Audio Blob is undefined");
          setIsSpeaking(false);
        }
      } catch (error) {
        console.error("Error during TTS request:", error);
        setIsSpeaking(false);
      }
    },
    [isSpeaking, ttsUrl, cache, cacheSize]
  );

  return debouncedSpeakText;
};
