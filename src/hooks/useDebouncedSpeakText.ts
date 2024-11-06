import { useState, useCallback } from "react";
import axios from "axios";

// Helper function to convert Base64 string to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export const useDebouncedSpeakText = (ttsUrl: string) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [cache, setCache] = useState<Record<string, string>>({});

  const debouncedSpeakText = useCallback(
    async (text: string, lang: string) => {
      if (isSpeaking) return;

      const cacheKey = `${text}-${lang}`;
      setIsSpeaking(true);

      try {
        let base64Audio = cache[cacheKey];

        // Fetch from API if not cached
        if (!base64Audio) {
          const response = await axios.post(
            ttsUrl,
            { text, lang },
            { responseType: "json" }
          );
          base64Audio = response.data.audio;
          setCache((prev) => ({ ...prev, [cacheKey]: base64Audio }));
        }

        // Decode Base64 into an ArrayBuffer
        const audioBuffer = base64ToArrayBuffer(base64Audio);

        // Use Web Audio API to play the audio
        const AudioContext =
          window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContext();
        const decodedAudio = await audioContext.decodeAudioData(audioBuffer);
        const source = audioContext.createBufferSource();
        source.buffer = decodedAudio;
        source.connect(audioContext.destination);
        source.start(0);

        source.onended = () => {
          setIsSpeaking(false);
          audioContext.close();
        };
      } catch (error) {
        console.error("Error during TTS request:", error);
        setIsSpeaking(false);
      }
    },
    [isSpeaking, ttsUrl, cache]
  );

  return debouncedSpeakText;
};
