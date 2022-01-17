import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { useUserContext } from "../../context/UserContextProvider";

export default function Header() {
  const { menuOpen, setMenuOpen } = useUserContext();
  return (
    <header className="header">
      <div className="menu">
        <button onClick={() => setMenuOpen(!menuOpen)} className="btn-menu">
          Menu
        </button>
      </div>
      <div className="logo">
        <Link href="/">Update Settings</Link>
      </div>
      <div className="wallet">
        <WalletMultiButton
          startIcon={
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          }
          className="btn-wallet"
        />
      </div>
    </header>
  );
}
