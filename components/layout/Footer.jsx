import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { DevTip } from "../DevTip";
import useWalletBalance from "../../context/WalletBalanceProvider";

export default function Footer() {
  const { walletAddress } = useWalletBalance();

  const shortWalletAddress =
    walletAddress.slice(0, 4) + ".." + walletAddress.slice(-4);

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
        <WalletMultiButton startIcon={null} className="btn-wallet--footer">
          <div className="relative ">
            {walletAddress ? (
              <span>
                <span className="mr-3">
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="break-all text-left">
                  {walletAddress}
                  {/* {shortWalletAddress} */}
                </span>
              </span>
            ) : (
              <span>
                <span className="mr-3">
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                Connect Wallet
              </span>
            )}
          </div>
        </WalletMultiButton>
      </div>
    </footer>
  );
}
