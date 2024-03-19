import { useTimeoutFn, useUnmount } from 'react-use';
import { useEffect, useState } from 'react';
import { formatTokenPrice } from 'utils/format';
import BigNumber from 'bignumber.js';

interface IEarnAmountCountProps {
  updateTime: number;
  amount: number | string;
  rate: number;
  followersNumber: number;
}

function computeAmountCount({ updateTime, amount, rate, followersNumber }: IEarnAmountCountProps) {
  const times = Math.floor(Math.max(0, Date.now() - updateTime) / 1000);

  return BigNumber(times)
    .times(rate)
    .times(followersNumber)
    .plus(BigNumber(amount).dividedBy(10 ** 8))
    .toString();
}

export function EarnAmountCount(props: IEarnAmountCountProps) {
  const [count, setCount] = useState(computeAmountCount(props));

  const [, cancel, reset] = useTimeoutFn(() => {
    setCount(computeAmountCount(props));
    reset();
  }, 1000);

  useUnmount(() => {
    cancel();
  });

  return <span className="font-medium  text-base text-neutralPrimary">{formatTokenPrice(count)}</span>;
}
