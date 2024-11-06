import { useState, useCallback } from "react";
import axios from "axios";

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

        // Check cache
        if (!base64Audio) {
          const response = await axios.post(
            ttsUrl,
            { text, lang },
            { responseType: "json" }
          );
          base64Audio = response.data.audio;
          setCache((prev) => ({ ...prev, [cacheKey]: base64Audio }));
        }

        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const audioBuffer = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          audioBuffer[i] = binaryString.charCodeAt(i);
        }

        const AudioContext =
          window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContext();
        const decodedAudio = await audioContext.decodeAudioData(
          audioBuffer.buffer
        );
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
