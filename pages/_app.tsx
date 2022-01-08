import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { FC, ReactNode } from "react";
import MainContextProvider from "../context/MainContextProvider";
import { WalletBalanceProvider } from "../context/WalletBalanceProvider";
import Header from "../components/layout/Header";
import { CandyMachineProvider } from "../context/CandyMachineProvider";

// Use require instead of import, and order matters
require("../styles/globals.css");
require("@solana/wallet-adapter-react-ui/styles.css");

const WalletConnectionProvider = dynamic<{ children: ReactNode }>(
  () =>
    import("../context/WalletConnectionProvider").then(
      ({ WalletConnectionProvider }) => WalletConnectionProvider
    ),
  {
    ssr: false,
  }
);

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <WalletConnectionProvider>
      <WalletModalProvider>
        <WalletBalanceProvider>
          <CandyMachineProvider>
            <MainContextProvider>
              <Header />
              <Component {...pageProps} />
            </MainContextProvider>
          </CandyMachineProvider>
        </WalletBalanceProvider>
      </WalletModalProvider>
    </WalletConnectionProvider>
  );
};

export default App;
