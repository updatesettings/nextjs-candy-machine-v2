import Countdown from "react-countdown";

interface MintCountdownProps {
  date: Date | undefined;
  style?: React.CSSProperties;
  status?: string;
  onComplete?: () => void;
}

interface MintCountdownRender {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

export const MintCountdown: React.FC<MintCountdownProps> = ({
  date,
  status,
  onComplete,
}) => {
  const renderCountdown = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: MintCountdownRender) => {
    hours += days * 24;
    if (completed) {
      return status ? (
        <div className="countdown-status">
          <span className="flex h-3 w-3 relative mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          {status}
        </div>
      ) : null;
    } else {
      return (
        <div className="countdown">
          <div className="countdown-item">
            <span className="countdown-num">
              {hours < 10 ? `0${hours}` : hours}
            </span>
            <span className="countdown-txt">hrs</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-num">
              {minutes < 10 ? `0${minutes}` : minutes}
            </span>
            <span className="countdown-txt">mins</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-num">
              {seconds < 10 ? `0${seconds}` : seconds}
            </span>
            <span className="countdown-txt">secs</span>
          </div>
        </div>
      );
    }
  };

  if (date) {
    return (
      <Countdown
        date={date}
        onComplete={onComplete}
        renderer={renderCountdown}
      />
    );
  } else {
    return null;
  }
};
