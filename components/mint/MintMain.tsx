// Mint Component so minting can be put on any page
import React, { useState, useMemo, useEffect } from "react";
import useCandyMachine from "../../context/CandyMachineProvider";
import { AlertState } from "../../utils/utils";
import { MintButton } from "./MintButton";
import { getPhase, Phase, PhaseHeader } from "./MintPhase";
import { GatewayProvider } from "@civic/solana-gateway-react";
import * as anchor from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Candy Machine
import {
  awaitTransactionSignatureConfirmation,
  CandyMachineAccount,
  CANDY_MACHINE_PROGRAM,
  getCandyMachineState,
  mintOneToken,
} from "../../utils/candy-machine";

interface Props {
  // none
}

const MintMain = () => {
  //Get Candy Machine Provider
  const { candyMachineId, connection, rpcHost, txTimeout } = useCandyMachine();

  const [isMinting, setIsMinting] = useState(false);
  // Notification State
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });
  // Candy Machine State
  const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>();

  const wallet = useWallet();

  // connect wallet
  const anchorWallet = useMemo(() => {
    if (
      !wallet ||
      !wallet.publicKey ||
      !wallet.signAllTransactions ||
      !wallet.signTransaction
    ) {
      return;
    }

    return {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    };
  }, [wallet]);

  // Mint Action

  const onMint = async () => {
    try {
      setIsMinting(true);
      document.getElementById("#identity")?.click();
      if (wallet.connected && candyMachine?.program && wallet.publicKey) {
        const mintTxId = (
          await mintOneToken(candyMachine, wallet.publicKey)
        )[0];

        let status: any = { err: true };
        if (mintTxId) {
          status = await awaitTransactionSignatureConfirmation(
            mintTxId,
            txTimeout,
            connection,
            "singleGossip",
            true
          );
        }

        if (!status?.err) {
          toast.success("🦄 Congrats! Mint Successful!");
          setAlertState({
            open: true,
            message: "Congratulations! Mint succeeded!",
            severity: "success",
          });
        } else {
          toast.error("Mint Fail! Try Again");
          setAlertState({
            open: true,
            message: "Mint failed! Please try again!",
            severity: "error",
          });
        }
      }
    } catch (error: any) {
      // TODO: blech:
      let message = error.msg || "Minting failed! Please try again!";
      if (!error.msg) {
        if (!error.message) {
          message = "Transaction Timeout! Please try again.";
        } else if (error.message.indexOf("0x138")) {
        } else if (error.message.indexOf("0x137")) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf("0x135")) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
          window.location.reload();
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }
      toast.error(message);
      setAlertState({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setIsMinting(false);
    }
  };

  // Effect
  useEffect(() => {
    (async () => {
      if (!anchorWallet) {
        return;
      }

      if (candyMachineId) {
        try {
          const cndy = await getCandyMachineState(
            anchorWallet,
            candyMachineId,
            connection
          );
          setCandyMachine(cndy);
        } catch (e) {
          console.log("Problem getting candy machine state");
          console.log(e);
        }
      } else {
        console.log("No candy machine detected in configuration.");
      }
    })();
  }, [anchorWallet, candyMachineId, connection]);

  const phase = getPhase(candyMachine);

  return (
    <div style={{ background: "#f1f1f1", padding: 20, borderRadius: 10 }}>
      <p>{rpcHost}</p>
      <p>{txTimeout}</p>
      <p>Phase: {phase}</p>
      <div>
        <PhaseHeader
          phase={phase}
          candyMachine={candyMachine}
          rpcHost={rpcHost}
        />
      </div>
      {!wallet.connected ? (
        <WalletMultiButton>Connect Wallet</WalletMultiButton>
      ) : (
        <div>
          {(phase === Phase.Phase2 || phase === Phase.Phase3) && (
            <>
              <div>
                <GatewayProvider
                  wallet={{
                    publicKey:
                      wallet.publicKey || new PublicKey(CANDY_MACHINE_PROGRAM),
                    //@ts-ignore
                    signTransaction: wallet.signTransaction,
                  }}
                  // // Replace with following when added
                  // gatekeeperNetwork={candyMachine.state.gatekeeper_network}
                  gatekeeperNetwork={
                    candyMachine?.state?.gatekeeper?.gatekeeperNetwork
                  } // This is the ignite (captcha) network
                  /// Don't need this for mainnet
                  clusterUrl={rpcHost}
                  options={{ autoShowModal: false }}
                >
                  {phase === Phase.Phase2 ? (
                    <button>whitelist button to do</button>
                  ) : (
                    // <WhitelistMintButton
                    //   candyMachine={candyMachine}
                    //   isMinting={isMinting}
                    //   onMint={onMint}
                    // />
                    <MintButton
                      candyMachine={candyMachine}
                      isMinting={isMinting}
                      onMint={onMint}
                    />
                  )}
                </GatewayProvider>
              </div>
            </>
          )}
        </div>
      )}
      {candyMachine && (
        <p>
          Minted: {candyMachine.state.itemsRedeemed} /{" "}
          {candyMachine.state.itemsAvailable}
        </p>
      )}

      <button onClick={() => toast("Wow so easy!")}>Notify!</button>

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
      {/* {alertState.message} */}
      <ToastContainer />
    </div>
  );
};

export default MintMain;
