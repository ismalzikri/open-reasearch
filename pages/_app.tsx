import "../styles/globals.css";
import type { AppProps } from "next/app";
import { TranslationProvider } from "../src/context/TranslationContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <TranslationProvider>
      <Component {...pageProps} />
    </TranslationProvider>
  );
}

export default MyApp;
