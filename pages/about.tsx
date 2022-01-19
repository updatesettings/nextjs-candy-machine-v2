import { NextPage } from "next";
import Head from "next/head";
import { BsTwitter } from "react-icons/bs";

const About: NextPage = () => {
  return (
    <>
      <Head>
        <title>About Update Settings</title>
      </Head>

      <div className="flex flex-col items-center justify-center text-pageText mt-24">
        <h1 className="text-2xl font-bold mb-2">About U.S.</h1>
        <p className="max-w-md text-center font-normal">
          We are a team of web3 enthusiasts providing open source templates,
          tools, and tutorials.
        </p>
        <a
          className="text-blue-600 hover:underline flex items-center gap-1"
          href="https://twitter.com/update_settings"
          target="_blank"
          rel="noreferrer"
        >
          <BsTwitter />
          Twitter
        </a>
      </div>
    </>
  );
};

export default About;
