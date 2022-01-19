import React, { ReactElement, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface Props {}

export default function RSVP({}: Props): ReactElement {
  const { publicKey } = useWallet();
  const [walletAddLoading, setWalletAddLoading] = useState(false);
  const [walletAdded, setWalletAdded] = useState("");

  const submitRSVP = async (walletAddress: any) => {
    setWalletAddLoading(true);
    const res = await fetch("/api/submit-form", {
      method: "POST",
      body: JSON.stringify({ walletAddress }),
    });
    // Success if status code is 201
    if (res.status === 201) {
      setWalletAdded("success");
      setWalletAddLoading(false);
    } else if (res.status === 409) {
      setWalletAdded("conflict");
      setWalletAddLoading(false);
    } else {
      setWalletAdded("error");
      setWalletAddLoading(false);
    }
  };

  const responseStatus = () => {
    switch (walletAdded) {
      case "success":
        return (
          <div className="bg-green-200 text-green-800 h-24 px-5 flex items-center justify-center">
            <b className="mr-2">Success:</b>You&#39;re on the list
          </div>
        );
      case "conflict":
        return (
          <div className="bg-yellow-200 text-yellow-800 h-24 px-5 flex items-center justify-center">
            You&#39;re already on the list
          </div>
        );
      case "error":
        return (
          <div className=" h-24 px-5  flex flex-col items-center">
            <button
              onClick={() => {
                let walletAddress = publicKey?.toBase58();
                submitRSVP(walletAddress);
              }}
              className="btn"
            >
              {walletAddLoading ? "Loading..." : "Sign Up"}
            </button>
            <p className="text-red-500 mt-1 text-2xs">Error Occurred</p>
          </div>
        );
      case "":
        return (
          <div className=" h-24 px-5  flex flex-col items-center">
            <button
              onClick={() => {
                let walletAddress = publicKey?.toBase58();
                submitRSVP(walletAddress);
              }}
              className="btn"
            >
              {walletAddLoading ? "Loading..." : "Sign Up"}
            </button>
          </div>
        );
    }
  };

  return (
    <div className="max-w-2xl text-pageText m-auto p-2 sm:p-4 md:p-8 flex flex-col justify-center items-center">
      <p className="mb-6 text-base ">
        Sign up for the Update Settings Whitelist.
      </p>
      {publicKey ? (
        <>
          {responseStatus()}
          <p className="text-2xs text-gray-600 pt-4">
            Connected address:{" "}
            <span className="break-all"> {publicKey.toBase58()}</span>
          </p>
        </>
      ) : (
        <WalletMultiButton className="btn-connect" />
      )}
    </div>
  );
}
