import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

export default function Footer() {
  return (
    <footer>
      <p>{new Date().getFullYear()}</p>
      <div className="">
        <WalletMultiButton className="btn-wallet" />
        <WalletDisconnectButton />
      </div>
    </footer>
  );
}
