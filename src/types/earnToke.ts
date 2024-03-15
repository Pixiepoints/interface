export interface IEarnToken {
  dappName: string;
  icon: string;
  domain: string;
  role: number;
  address: string;
  describe: string;
  firstSymbolAmount: number;
  secondSymbolAmount: number;
  thirdSymbolAmount: number;
  rate: number;
  updateTime: number;
  followersNumber: number;
}

export interface IEarnListResults {
  totalCount: number;
  totalEarned: number;
  symbol: string;
  items: Array<IEarnToken>;
}

export interface IEarnListParams {
  dappName: string;
  role: number;
  sorting?: string;
  skipCount: number;
  maxResultCount: number;
  Address: string;
  sortingKeyWord?: string;
}

export interface IEarnTokenDetailProps {
  dappName: string;
  address: string;
  domain: string;
}

export interface IPointDetail {
  action: string;
  symbol: string;
  amount: number;
  updateTime: number;
  rate: number;
  followersNumber: number;
  displayName: string;
}

export interface IEarnTokenDetailResults {
  dappName: string;
  address: string;
  domain: string;
  icon: string;
  describe: string;
  pointDetails: Array<IPointDetail>;
}
