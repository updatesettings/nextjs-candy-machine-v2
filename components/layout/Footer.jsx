import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { DevTip } from "../DevTip";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="flex flex-col items-start">
        <DevTip />
        <a
          className="footer-copy"
          href="https://updatesettings.com/"
          target="_blank"
          rel="noreferrer"
        >
          Update Settings © {new Date().getFullYear()}
        </a>
      </div>

      <div className="footer-button">
        <WalletMultiButton className="btn-wallet--footer" />
      </div>
    </footer>
  );
}
