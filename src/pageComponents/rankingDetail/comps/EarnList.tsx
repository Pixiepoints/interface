import BigNumber from 'bignumber.js';
import { EarnAmountCount } from 'pageComponents/ranking/comps/EarnAmountDynamic';
import { formatTokenPrice } from 'utils/format';

interface IPointDetail {
  action: string;
  symbol: string;
  amount: number;
  updateTime: number;
  rate: number;
  followersNumber: number;
  displayName: string;
  inviteFollowersNumber: number;
  inviteRate: number;
  thirdFollowersNumber: number;
  thirdRate: number;
}

interface ITokenEarnListProps {
  dataSource: Array<IPointDetail>;
}

function PointListItem({ action, displayName, symbol, amount, ...props }: IPointDetail) {
  return (
    <div className="flex items-center justify-between py-4 md:py-7 gap-x-8 border-0 border-b border-solid border-neutralBorder">
      <span className=" flex-1 text-neutralSecondary break-all">{displayName}</span>
      <span className=" font-medium text-neutralPrimary">
        {action === 'SelfIncrease' ? (
          <>
            <EarnAmountCount {...props} amount={amount} />
            {` ${symbol}`}
          </>
        ) : (
          `${formatTokenPrice(
            BigNumber(amount)
              .dividedBy(10 ** 8)
              .toNumber(),
          )} ${symbol}`
        )}
      </span>
    </div>
  );
}

export function TokenEarnList({ dataSource }: ITokenEarnListProps) {
  if (!dataSource?.length)
    return <div className="py-10 text-center text-base text-neutralSecondary">No points obtained</div>;
  return (
    <div>
      {dataSource.map((pointDetail) => (
        <PointListItem {...pointDetail} key={pointDetail.action}></PointListItem>
      ))}
    </div>
  );
}
