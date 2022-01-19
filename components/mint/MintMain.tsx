import { useEffect, useMemo, useState, useCallback } from "react";
import * as anchor from "@project-serum/anchor";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  awaitTransactionSignatureConfirmation,
  CandyMachineAccount,
  CANDY_MACHINE_PROGRAM,
  getCandyMachineState,
  mintOneToken,
} from "../../utils/candy-machine";
import {
  AlertState,
  getAtaForMint,
  toDate,
  formatNumber,
} from "../../utils/utils";
import { MintButton } from "./MintButton";
import { GatewayProvider } from "@civic/solana-gateway-react";
import { toast } from "react-toastify";
import { MintCountdown } from "./MintCountdown";

export interface MintMainProps {
  candyMachineId?: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  startDate: number;
  txTimeout: number;
  rpcHost: string;
}

const MintMain = (props: MintMainProps) => {
  const [isUserMinting, setIsUserMinting] = useState(false);
  const [candyMachineLoading, setCandyMachineLoading] = useState(false);
  const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>();
  const [whitelistEnabled, setWhitelistEnabled] = useState(false);
  const [whitelistTokenBalance, setWhitelistTokenBalance] = useState(0);
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  const rpcUrl = props.rpcHost;
  const wallet = useWallet();

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
    } as anchor.Wallet;
  }, [wallet]);

  const refreshCandyMachineState = useCallback(async () => {
    if (!anchorWallet) {
      return;
    }

    if (props.candyMachineId) {
      setCandyMachineLoading(true);
      try {
        const cndy = await getCandyMachineState(
          anchorWallet,
          props.candyMachineId,
          props.connection
        );
        setCandyMachine(cndy);

        if (cndy.state.whitelistMintSettings) {
          setWhitelistEnabled(true);
          let balance = 0;
          try {
            const tokenBalance = await props.connection.getTokenAccountBalance(
              (
                await getAtaForMint(
                  cndy.state.whitelistMintSettings.mint,
                  anchorWallet.publicKey
                )
              )[0]
            );

            balance = tokenBalance?.value?.uiAmount || 0;
          } catch (e) {
            console.error("no balance found", e);
            balance = 0;
          }
          if (balance > 0) {
            setWhitelistEnabled(true);
            setWhitelistTokenBalance(balance);
          } else {
            setWhitelistEnabled(false);
          }
        } else {
          setWhitelistEnabled(false);
        }
      } catch (e) {
        console.log("There was a problem fetching Candy Machine state");
        console.log(e);
      }
      setCandyMachineLoading(false);
    }
  }, [anchorWallet, props.candyMachineId, props.connection]);

  const onMint = async () => {
    try {
      setIsUserMinting(true);
      document.getElementById("#identity")?.click();
      if (wallet.connected && candyMachine?.program && wallet.publicKey) {
        const mintTxId = (
          await mintOneToken(candyMachine, wallet.publicKey)
        )[0];

        let status: any = { err: true };
        if (mintTxId) {
          status = await awaitTransactionSignatureConfirmation(
            mintTxId,
            props.txTimeout,
            props.connection,
            true
          );
        }

        if (status && !status.err) {
          toast.success("Congratulations! Mint succeeded!");
          setAlertState({
            open: true,
            message: "Congratulations! Mint succeeded!",
            severity: "success",
          });
        } else {
          toast.error("Mint failed! Please try again!");
          setAlertState({
            open: true,
            message: "Mint failed! Please try again!",
            severity: "error",
          });
        }
      }
    } catch (error: any) {
      let message = error.msg || "Minting failed! Please try again!";
      if (!error.msg) {
        if (!error.message) {
          message = "Transaction Timeout! Please try again.";
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
      setIsUserMinting(false);
      refreshCandyMachineState();
    }
  };

  useEffect(() => {
    refreshCandyMachineState();
  }, [
    anchorWallet,
    props.candyMachineId,
    props.connection,
    refreshCandyMachineState,
    candyMachine?.state?.isActive,
  ]);

  if (candyMachineLoading) {
    return (
      <div className="mint-wrapper--loading" style={{ height: 280 }}>
        <svg
          className="animate-spin -ml-1 mr-3 h-10 w-10 text-slate-300"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  if (!whitelistEnabled && !candyMachine?.state.goLiveDate) {
    return (
      <div className="mint-wrapper">
        <MintCountdown
          date={toDate(
            candyMachine?.state.goLiveDate
              ? candyMachine?.state.goLiveDate
              : candyMachine?.state.isPresale
              ? new anchor.BN(new Date().getTime() / 1000)
              : undefined
          )}
          status={
            !candyMachine?.state?.isActive || candyMachine?.state?.isSoldOut
              ? "COMPLETED"
              : candyMachine?.state.isPresale
              ? "PRESALE"
              : "LIVE"
          }
        />
      </div>
    );
  }

  return (
    <div className="mint-wrapper">
      <MintCountdown
        date={toDate(
          candyMachine?.state.goLiveDate
            ? candyMachine?.state.goLiveDate
            : candyMachine?.state.isPresale
            ? new anchor.BN(new Date().getTime() / 1000)
            : undefined
        )}
        status={
          !candyMachine?.state?.isActive || candyMachine?.state?.isSoldOut
            ? "COMPLETED"
            : candyMachine?.state.isPresale
            ? "PRESALE"
            : "LIVE"
        }
      />
      <div className="mint-card">
        {!wallet.connected ? (
          <WalletMultiButton className="btn-connect btn-reverse m-auto">
            Connect Wallet
          </WalletMultiButton>
        ) : (
          <>
            <div className="price">
              <span className="price-regular">
                Price:{" "}
                <span
                  className={
                    whitelistEnabled ? "price-regular--has-discount" : ""
                  }
                >
                  ◎ {formatNumber.asNumber(candyMachine?.state.price!)}
                </span>
              </span>
              {whitelistEnabled && (
                <span className="price-discount">
                  ◎{" "}
                  {formatNumber.asNumber(
                    candyMachine?.state.whitelistMintSettings?.discountPrice!
                  )}
                </span>
              )}
              {whitelistEnabled && (
                <div className="price-whitelist-notification">
                  Whitelist Activated
                  {/* <span>{whitelistTokenBalance}</span> */}
                </div>
              )}
            </div>
            <div className="m-auto w-fit p-3 sm:p-4">
              {candyMachine?.state.isActive &&
              candyMachine?.state.gatekeeper &&
              wallet.publicKey &&
              wallet.signTransaction ? (
                <GatewayProvider
                  wallet={{
                    publicKey:
                      wallet.publicKey || new PublicKey(CANDY_MACHINE_PROGRAM),
                    //@ts-ignore
                    signTransaction: wallet.signTransaction,
                  }}
                  gatekeeperNetwork={
                    candyMachine?.state?.gatekeeper?.gatekeeperNetwork
                  }
                  clusterUrl={rpcUrl}
                  options={{ autoShowModal: false }}
                >
                  <MintButton
                    candyMachine={candyMachine}
                    isMinting={isUserMinting}
                    onMint={onMint}
                  />
                </GatewayProvider>
              ) : (
                <>
                  <MintButton
                    candyMachine={candyMachine}
                    isMinting={isUserMinting}
                    onMint={onMint}
                  />
                </>
              )}
            </div>
          </>
        )}
      </div>
      {candyMachine && (
        <div className="mint-count">
          Count:{" "}
          {`${candyMachine?.state.itemsRemaining} / ${candyMachine?.state.itemsAvailable}`}
        </div>
      )}
    </div>
  );
};

export default MintMain;
