import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { FC, ReactNode } from "react";
import UserContextProvider from "../context/UserContextProvider";
import { WalletBalanceProvider } from "../context/WalletBalanceProvider";
import Layout from "../components/layout/Layout";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
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
          <UserContextProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <ToastContainer />
          </UserContextProvider>
        </WalletBalanceProvider>
      </WalletModalProvider>
    </WalletConnectionProvider>
  );
};

export default App;
