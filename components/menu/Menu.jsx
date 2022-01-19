import Link from "next/link";
import { useUserContext } from "../../context/UserContextProvider";
import useWalletBalance from "../../context/WalletBalanceProvider";
// import { isBrowser } from "../../utils/utils";

// To Do
// Add ESC key to close

export default function Menu() {
  const { menuOpen, setMenuOpen } = useUserContext();
  const { walletAddress } = useWalletBalance();

  const menuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div
      className={menuOpen ? "menu-wrapper" : "menu-wrapper--hidden"}
      onClick={menuToggle}
    >
      <div className="menu-bar">
        <div className="menu-bar-content">
          <div className="flex justify-end">
            <button className="menu-bar-close" onClick={menuToggle}>
              &#xd7;
            </button>
          </div>
          <nav className="menu-bar-links">
            <ul>
              <li>
                <Link href="/">
                  <a className="menu-bar-link" onClick={menuToggle}>
                    Home
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/mint">
                  <a className="menu-bar-link" onClick={menuToggle}>
                    Mint
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="menu-bar-link" onClick={menuToggle}>
                    About
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/nft">
                  <a
                    className={
                      !walletAddress
                        ? "pointer-events-none menu-bar-link opacity-50 relative"
                        : "menu-bar-link"
                    }
                    onClick={menuToggle}
                  >
                    NFT Collection{" "}
                    {!walletAddress && (
                      <span className="absolute left-0 -bottom-6 text-pageBG text-2xs font-normal">
                        Connect wallet for access
                      </span>
                    )}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/rsvp">
                  <a className="menu-bar-link" onClick={menuToggle}>
                    Whitelist
                  </a>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
