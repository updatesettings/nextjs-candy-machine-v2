import Countdown from 'react-countdown';



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
  style,
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
      return status ? <span >{status}</span> : null;
    } else {
      return (
        <div  style={style}>
          <div>
            <span>
              {hours < 10 ? `0${hours}` : hours}
            </span>
            <span>hrs</span>
          </div>
          <div>
            <span>
              {minutes < 10 ? `0${minutes}` : minutes}
            </span>
            <span>mins</span>
          </div>
          <div>
            <span>
              {seconds < 10 ? `0${seconds}` : seconds}
            </span>
            <span>secs</span>
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
