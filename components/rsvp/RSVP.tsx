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
    } else {
      setWalletAdded("error");
      setWalletAddLoading(false);
    }
  };

  return (
    <div>
      {publicKey ? (
        <>
          {walletAdded === "success" ? (
            <div className="alert alert-success ">
              <label className="text-center">
                <b className="mr-2">Success:</b>You&#39;re on the list
              </label>
            </div>
          ) : (
            <button
              onClick={() => {
                let walletAddress = publicKey.toBase58();
                submitRSVP(walletAddress);
              }}
              className={`btn btn-primary btn-block max-w-md ${
                walletAddLoading ? "loading" : ""
              }`}
            >
              RSVP
            </button>
          )}

          <p className="text-sm text-gray-600 pt-4">
            Connected address: {publicKey.toBase58()}
          </p>
        </>
      ) : (
        <WalletMultiButton className="mx-auto" />
      )}
    </div>
  );
}
