import { MintCountdown } from "./MintCountdown";
import { toDate, formatNumber } from "../../utils/utils";
import { CandyMachineAccount } from "../../utils/candy-machine";

type HeaderProps = {
  candyMachine?: CandyMachineAccount;
};

export const Header = ({ candyMachine }: HeaderProps) => {
  return (
    <div>
      <div>
        {candyMachine && (
          <div>
            <div>
              <p>Remaining</p>
              <p
                style={{
                  fontWeight: "bold",
                }}
              >
                {`${candyMachine?.state.itemsRemaining}`}
              </p>
            </div>
            <div>
              <p>Price</p>
              <p style={{ fontWeight: "bold" }}>
                ◎ {formatNumber.asNumber(candyMachine?.state.price!)}
              </p>
              <p style={{ fontWeight: "bold" }}>
                Whitelist Discount ◎{" "}
                {formatNumber.asNumber(
                  candyMachine?.state.whitelistMintSettings?.discountPrice!
                )}
              </p>
            </div>
          </div>
        )}
        <MintCountdown
          date={toDate(candyMachine?.state.goLiveDate)}
          style={{ justifyContent: "flex-end" }}
          status={
            !candyMachine?.state?.isActive || candyMachine?.state?.isSoldOut
              ? "COMPLETED"
              : "LIVE"
          }
        />
      </div>
    </div>
  );
};
