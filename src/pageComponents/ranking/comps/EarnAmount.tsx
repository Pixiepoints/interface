import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { formatTokenPrice } from 'utils/format';

export default function EarnAmount({ amount }: { amount: string | number }) {
  const amountText = useMemo(() => {
    return formatTokenPrice(
      BigNumber(amount || 0)
        .dividedBy(10 ** 8)
        .toNumber(),
    );
  }, [amount]);

  return <span className="text-neutralPrimary text-base font-medium">{amountText}</span>;
}
