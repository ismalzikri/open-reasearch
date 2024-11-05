import { useState, useCallback } from "react";
import axios from "axios";

export const useDebouncedSpeakText = (ttsUrl: string) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const debouncedSpeakText = useCallback(
    async (text: string, lang: string) => {
      if (isSpeaking) return;

      setIsSpeaking(true);
      try {
        // Request Base64 audio data from the API
        const response = await axios.post(
          ttsUrl,
          { text, lang },
          { responseType: "json" } // Expect JSON response with Base64 audio
        );

        // Assuming the API response is structured like { audio: "base64string..." }
        const base64Audio = response.data.audio;

        // Decode Base64 to ArrayBuffer
        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const audioBuffer = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          audioBuffer[i] = binaryString.charCodeAt(i);
        }

        // Play the audio using Web Audio API
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

        // When playback ends, reset isSpeaking state
        source.onended = () => setIsSpeaking(false);
      } catch (error) {
        console.error("Error during TTS request:", error);
        setIsSpeaking(false);
      }
    },
    [isSpeaking, ttsUrl]
  );

  return debouncedSpeakText;
};
