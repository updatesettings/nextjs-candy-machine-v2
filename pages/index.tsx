import { NextPage } from "next";
import Head from "next/head";
import { useUserContext } from "../context/UserContextProvider";
import useWalletBalance from "../context/WalletBalanceProvider";

const Index: NextPage = () => {
  const { demo, setDemo } = useUserContext();
  const { balance } = useWalletBalance();
  return (
    <div className="">
      <Head>
        <title>Next.js CMv2 Demo</title>
        <meta name="description" content="Candy Machine V2 Demo with Next.js" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:image" content="/seo.png" />
      </Head>

      <main className="">
        <h1 className="">{demo}</h1>
        <button
          className="btn"
          onClick={() => setDemo("Demo Changing Context")}
        >
          Click me
        </button>
        <button
          className="btn-outline"
          onClick={() => setDemo("Demo Changing Context")}
        >
          Click me
        </button>
        <p>{balance}</p>
      </main>
    </div>
  );
};

export default Index;
