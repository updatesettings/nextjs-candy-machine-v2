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
        <WalletMultiButton className="btn-wallet" />
      </div>
    </header>
  );
}
