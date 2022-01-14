import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

export default function Footer() {
  return (
    <footer className="footer">
      <a
        className="footer-copy"
        href="https://updatesettings.com/"
        target="_blank"
        rel="noreferrer"
      >
        Update Settings © {new Date().getFullYear()}
      </a>
      <div className="flex flex-row">
        <div className="footer-button">
          <WalletMultiButton className="btn-wallet--footer" />
        </div>
      </div>
    </footer>
  );
}
