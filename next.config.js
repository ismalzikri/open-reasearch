/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    URL_TRANSLATION: process.env.URL_TRANSLATION,
  },
  images: {
    domains: ["color-assistant.vercel.app"],
  },
};
