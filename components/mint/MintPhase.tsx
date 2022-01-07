import * as anchor from "@project-serum/anchor";
import { PhaseCountdown } from "./Countdown";
import { toDate } from "../../utils/utils";
import { CandyMachineAccount } from "../../utils/candy-machine";

export enum Phase {
  GracePeriod, // We will use this for when whitelist users can mint
  Phase1,
  Phase2,
  Phase3,
  Unknown,
}

export function getPhase(candyMachine: CandyMachineAccount | undefined): Phase {
  const curr = new Date().getTime();
  const candyMachineGoLive = toDate(candyMachine?.state.goLiveDate)?.getTime();

  if (candyMachineGoLive && curr < candyMachineGoLive) {
    return Phase.Phase2;
  } else if (candyMachineGoLive && curr > candyMachineGoLive) {
    return Phase.Phase3;
  }
  return Phase.Unknown;

  // if (curr < whitelistGoLive) {
  //   //Countdown before whitelist button
  //   return Phase.Phase1;
  // } else if (curr > ) {
  //   // whitelist mint time
  //   return Phase.Phase2;
  // } else if (curr > whitelistGoLive) {
  //   // public mint
  //   return Phase.Phase3;
  // }
}

const Header = (props: {
  phaseName: string;
  desc: string;
  date: anchor.BN | undefined;
  status?: string;
}) => {
  const { phaseName, desc, date, status } = props;
  return (
    <div>
      <h3 style={{ fontWeight: 600 }}>{phaseName}</h3>
      <p style={{ marginTop: 20, color: "#082c19" }}>{desc}</p>
      <PhaseCountdown
        date={toDate(date)}
        status={status || "COMPLETE"}
        style={{ margin: "0 auto" }}
      />
    </div>
  );
};

type PhaseHeaderProps = {
  phase: Phase;
  candyMachine?: CandyMachineAccount;
  rpcHost: string;
};

export const PhaseHeader = ({
  phase,
  candyMachine,
  rpcHost,
}: PhaseHeaderProps) => {
  // const wallet = useWallet();

  return (
    <>
      {phase === Phase.Unknown && !candyMachine && (
        <Header
          phaseName={""}
          desc={"Waiting for you to connect your wallet."}
          date={undefined}
        />
      )}

      {phase === Phase.Phase1 && candyMachine && (
        <Header
          phaseName={"Timekeepers Releasing in: Phase 1"}
          desc={""}
          date={candyMachine?.state.goLiveDate}
          status=""
        />
      )}

      {phase === Phase.Phase2 && candyMachine && (
        <Header
          phaseName={"Public Mint in:"}
          desc={"Whitelist now live"}
          date={candyMachine?.state.goLiveDate}
          status="PUBLIC MINT LIVE - RELOAD PAGE"
        />
      )}

      {phase === Phase.Phase3 && candyMachine && (
        <Header
          phaseName={""}
          desc={"This is a description"}
          date={candyMachine?.state.goLiveDate}
          status="LIVE"
        />
      )}
    </>
  );
};
