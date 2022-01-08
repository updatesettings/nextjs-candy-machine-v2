import { createContext, useContext } from "react";
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import * as anchor from "@project-serum/anchor";

const CandyMachineContext = createContext(null);

const getCandyMachineId = (): anchor.web3.PublicKey | undefined => {
  try {
    const candyMachineId = new anchor.web3.PublicKey(
      process.env.NEXT_PUBLIC_CANDY_MACHINE_ID!,
    );

    return candyMachineId;
  } catch (e) {
    console.log('Failed to construct CandyMachineId', e);
    return undefined;
  }
};

const candyMachineId = getCandyMachineId();
const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork;
const rpcHost = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!;
const connection = new anchor.web3.Connection(rpcHost);

const startDate = parseInt(process.env.NEXT_PUBLIC_CANDY_START_DATE!, 10);
const txTimeout = 30000;





export const CandyMachineProvider: React.FC<{}> = ({ children }) => {

  return (
    <CandyMachineContext.Provider value={[candyMachineId, network, connection, startDate, txTimeout, rpcHost] as any}>
      {children}
    </CandyMachineContext.Provider>
  );
};


export default function useCandyMachine() {
  const [candyMachineId, network, connection, startDate, txTimeout, rpcHost]: any = useContext(CandyMachineContext);
  return [candyMachineId, network, connection, startDate, txTimeout, rpcHost];
}