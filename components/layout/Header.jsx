import { useEffect } from "react";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useUserContext } from "../../context/UserContextProvider";
import { FaWallet } from "react-icons/fa";
import useWalletBalance from "../../context/WalletBalanceProvider";

export default function Header() {
  const { menuOpen, setMenuOpen } = useUserContext();
  const { walletAddress } = useWalletBalance();

  const shortWalletAddress =
    walletAddress.slice(0, 4) + ".." + walletAddress.slice(-4);

  return (
    <header className="header">
      <div className="menu">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="space-y-1.5 block"
        >
          <div className="w-8 sm:w-10 h-1 sm:h-1.5 bg-pageText"></div>
          <div className="w-8 sm:w-10 h-1 sm:h-1.5 bg-pageText"></div>
          <div className="w-8 sm:w-10 h-1 sm:h-1.5 bg-pageText"></div>
        </button>
      </div>
      <div className="logo">
        <Link href="/">Update Settings</Link>
      </div>
      <div className="wallet">
        {/* <span className="flex h-3 w-3 relative mr-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span> */}
        <WalletMultiButton startIcon={null} className="btn-wallet">
          <div className="relative ">
            <FaWallet className="btn-wallet-icon inline-block" />

            {walletAddress ? (
              <span className="absolute bottom-1 translate-y-full  -right-2 sm:right-1/2 sm:translate-x-1/2  text-3xs p-0 leading-4 text-center">
                {shortWalletAddress}
              </span>
            ) : (
              <span className="absolute  bottom-3 md:bottom-1 translate-y-full  right-1/2 translate-x-1/2  text-3xs p-0 leading-4 text-center">
                Login
              </span>
            )}
          </div>
        </WalletMultiButton>
      </div>
    </header>
  );
}
