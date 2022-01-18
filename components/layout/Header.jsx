import { useEffect } from "react";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useUserContext } from "../../context/UserContextProvider";
import { FaWallet } from "react-icons/fa";
import useWalletBalance from "../../context/WalletBalanceProvider";

export default function Header() {
  const { menuOpen, setMenuOpen } = useUserContext();
  const { balance, walletAddress } = useWalletBalance();

  const shortWalletAddress =
    walletAddress.slice(0, 4) + ".." + walletAddress.slice(-4);

  useEffect(() => {
    console.log("update");
  }, [walletAddress]);

  return (
    <header className="header">
      <div className="menu">
        {/* <button onClick={() => setMenuOpen(!menuOpen)} className="btn-menu">
          Menu
        </button> */}
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
        {/* <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span> */}
        <WalletMultiButton startIcon={null} className="btn-wallet">
          <div className="relative ">
            <FaWallet className="btn-wallet-icon inline-block" />
            <span className="absolute bottom-0 translate-y-full right-1/2 translate-x-1/2  text-2xs p-0 leading-4 text-center">
              {walletAddress ? shortWalletAddress : "Login"}
            </span>
          </div>
        </WalletMultiButton>
      </div>
    </header>
  );
}
