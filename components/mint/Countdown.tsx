import Countdown from "react-countdown";
import { useState } from "react";

interface PhaseCountdownProps {
  date: Date | undefined;
  style?: React.CSSProperties;
  status?: string;
  onComplete?: () => void;
  start?: Date;
  end?: Date;
}

interface CountdownRender {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

export const PhaseCountdown: React.FC<PhaseCountdownProps> = ({
  date,
  status,
  style,
  start,
  end,
  onComplete,
}) => {
  const [isFixed, setIsFixed] = useState(
    start && end && date ? start.getTime() - Date.now() < 0 : false
  );

  const renderCountdown = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: CountdownRender) => {
    hours += days * 24;
    if (completed) {
      return status ? <span>{status}</span> : null;
    } else {
      return (
        <div>
          {isFixed && (
            <div>
              <span>+</span>
            </div>
          )}
          <div>
            <span>{hours < 10 ? `0${hours}` : hours}</span>
            <span>hrs</span>
          </div>
          <div>
            <span>{minutes < 10 ? `0${minutes}` : minutes}</span>
            <span>mins</span>
          </div>
          <div>
            <span>{seconds < 10 ? `0${seconds}` : seconds}</span>
            <span>secs</span>
          </div>
        </div>
      );
    }
  };

  if (date && start && end) {
    if (isFixed) {
      <Countdown
        date={start}
        now={() => end.getTime()}
        onComplete={() => setIsFixed(false)}
        renderer={renderCountdown}
      />;
    }
  }

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
