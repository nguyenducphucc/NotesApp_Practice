import { useState } from "react";

const intoTime = (count) => {
  if (count < 60) return <strong>{count}s</strong>;
  if (count < 3600)
    return (
      <strong>
        {parseInt(count / 60)}m {count % 60}s
      </strong>
    );

  const hour = parseInt(count / 3600);
  count %= 3600;
  const minute = parseInt(count / 60);
  count %= 60;
  return (
    <strong>
      {hour}h {minute}m {count}s
    </strong>
  );
};

const Timer = () => {
  const [count, setCount] = useState(0);

  setTimeout(() => {
    setCount(count + 1);
  }, 1000);

  return (
    <div>
      <p>You have opened this app for {intoTime(count)}</p>
    </div>
  );
};

export default Timer;
