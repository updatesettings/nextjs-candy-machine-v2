import { createContext, useContext } from "react";
import * as anchor from "@project-serum/anchor";

const CandyMachineContext = createContext(null);

const candyMachineId = process.env.NEXT_PUBLIC_CANDY_MACHINE_ID
  ? new anchor.web3.PublicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE_ID)
  : undefined;

const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork;

const rpcHost = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!;
const connection = new anchor.web3.Connection(rpcHost);

const txTimeout = 30000; // milliseconds (confirm this works for your project)

// const rpcHost = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!;
// const connection = new anchor.web3.Connection(rpcHost);

export default function useCandyMachine() {
  const value: any = useContext(CandyMachineContext);
  return value;
}

export const CandyMachineProvider: React.FC<{}> = ({ children }) => {
  const value = { candyMachineId, network, connection, rpcHost, txTimeout };
  return (
    <CandyMachineContext.Provider value={value}>
      {children}
    </CandyMachineContext.Provider>
  );
};
