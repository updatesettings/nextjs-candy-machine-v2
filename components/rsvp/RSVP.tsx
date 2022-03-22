import React, { ReactElement, useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useForm } from "react-hook-form";
import siteData from "../../data/siteData";

interface Props {}

export default function RSVP({}: Props): ReactElement {
  const { publicKey } = useWallet();
  const [walletAddLoading, setWalletAddLoading] = useState(false);
  const [walletAdded, setWalletAdded] = useState("");
  const {
    register,
    getValues,
    formState: { errors, isDirty, isValid },
  } = useForm({ mode: "onChange", delayError: 1500 });

  const submitRSVP = async (walletAddress: any, discord: string) => {
    setWalletAddLoading(true);
    const res = await fetch("/api/submit-form", {
      method: "POST",
      body: JSON.stringify({ walletAddress, discord }),
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

  const rsvpForm = () => (
    <div className="px-5 w-full">
      <div>
        <form>
          <br />
          <label className="text-pageText text-lg font-bold mb-2">
            Discord Username
          </label>
          <input
            className="input mb-4"
            placeholder="emorb#1234"
            {...register("discord", {
              pattern: /^.{3,32}#[0-9]{4}$/,
              required: true,
            })}
          />
          {errors.discord && (
            <p className="text-xs text-red-500">
              Please enter discord username including discriminator numbers.
              e.g. emorb#1234
            </p>
          )}
          <br />
          <button
            className="btn"
            type="button"
            disabled={!isDirty || !isValid}
            onClick={() => {
              let walletAddress = publicKey?.toBase58();
              const discord = getValues("discord");
              submitRSVP(walletAddress, discord);
            }}
          >
            Sign Up Whitelist
          </button>
          <br />
        </form>
      </div>
    </div>
  );

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
          <div>
            {rsvpForm()}
            <p className="text-red-500 mt-1 text-2xs">Error Occurred</p>
          </div>
        );
      case "":
        return rsvpForm();
    }
  };

  return (
    <div className="max-w-2xl text-pageText m-auto p-2 sm:p-4 md:p-8 flex flex-col justify-center items-center">
      <p className="mb-6 text-base ">
        Sign up for the {siteData.site} Whitelist.
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
