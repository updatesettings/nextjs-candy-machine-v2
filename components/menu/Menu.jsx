import Link from "next/link";
import { useUserContext } from "../../context/UserContextProvider";
// import { isBrowser } from "../../utils/utils";

// To Do
// Add ESC key to close

export default function Menu() {
  const { menuOpen, setMenuOpen } = useUserContext();

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
                  <a className="menu-bar-link" onClick={menuToggle}>
                    NFT Collection
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
