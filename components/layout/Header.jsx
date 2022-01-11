import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

export default function Header() {
  return (
    <div>
      <div className="walletButtons">
        <WalletMultiButton />
        <WalletDisconnectButton />
      </div>
    </div>
  );
}
