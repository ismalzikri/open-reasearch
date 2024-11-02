// src/context/TranslationContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "axios";
import { knownColors } from "../data/colors";

type TranslationContextType = {
  translatedColors: { name: string; code: string }[];
  renderText: string;
};

const TranslationContext = createContext<TranslationContextType | null>(null);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [translatedColors, setTranslatedColors] = useState(knownColors);
  const [renderText, setRenderText] = useState("");
  const translationUrl = `${process.env.URL_TRANSLATION}/translate`;

  const fetchTranslations = async () => {
    try {
      const response = await axios.post(translationUrl, {
        colors: knownColors,
        to: navigator.language || "en",
        renderText: "The color is",
      });
      const data = response.data;

      // Update state with fetched translations
      setTranslatedColors(data.colors);
      setRenderText(data.renderText);

      // Cache the translations in localStorage
      localStorage.setItem("translatedColors", JSON.stringify(data.colors));
      localStorage.setItem("renderText", data.renderText);
    } catch (error) {
      console.error("Failed to fetch translation API:", error);
    }
  };

  useEffect(() => {
    // Check for cached translations
    const cachedColors = localStorage.getItem("translatedColors");
    const cachedRenderText = localStorage.getItem("renderText");

    if (cachedColors && cachedRenderText) {
      // Use cached translations if available
      setTranslatedColors(JSON.parse(cachedColors));
      setRenderText(cachedRenderText);
    } else {
      // Otherwise, fetch translations from API
      fetchTranslations();
    }
  }, []);

  return (
    <TranslationContext.Provider value={{ translatedColors, renderText }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};
