import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
const Home: NextPage = () => {
  return (
    <div className="w-full">
      <Head>
        <title>Color Assistant | Helping blind poeple</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col max-w-screen-md mx-auto">
        <div className="w-full flex flex-row h-20 items-center justify-between p-4 md:p-0">
          <div className="flex flex-row">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z"
              />
            </svg>
            Color Assistant
          </div>
          <a className="flex flex-row" href="https://github.com/ismalzikri">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
            Star on Github
          </a>
        </div>
        <div>
          <div className="text-3xl font-semibold lg:pt-20 lg:mb-4 text-center md:text-5xl p-10 lg:leading-[55px]">
            Generating color name captured from real-world using Machine
            Learning
          </div>
          <p className="text-center italic lg:mb-8 p-8 text-sm lg:text-base lg:p-[unset]">
            "Step into a world of enhanced possibilities with Color Assistant,
            an app born out of my personal commitment to making a meaningful
            impact on the lives of those with visual impairments. This
            innovative tool is designed to provide a tailored and seamless
            experience, allowing individuals to confidently identify and
            appreciate colors in their surroundings. As someone passionate about
            fostering independence, I invite you to explore the app's
            user-friendly interface and real-time feedback, empowering users to
            make informed decisions in their daily lives. Join me in creating a
            more inclusive and vibrant world, where everyone can navigate their
            surroundings with confidence and ease."
          </p>
          <div className="mb-6 text-center">
            <Link href="/app">
              <button className="py-4 px-6 bg-white text-black font-semibold rounded-full">
                Explore the color
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
