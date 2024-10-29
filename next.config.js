/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    URL_TRANSLATION: process.env.URL_TRANSLATION,
    URL_TEXTTOSPEECH: process.env.URL_TEXTTOSPEECH,
  },
  images: {
    domains: ["color-assistant.vercel.app"],
  },
};
