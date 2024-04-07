interface ITokenParams {
  grant_type: string;
  scope: string;
  client_id: string;
  pubkey?: string;
  version?: string;
  signature?: string;
  timestamp?: number;
  accountInfo?: Array<{ chainId: string; address: string }>;
  source: string;
}

interface IUsersAddressReq {
  address: string;
}

interface IUsersAddressRes {
  address: string;
  fullAddress: string;
  name: string;
  profileImage: string;
  profileImageOriginal: string;
  bannerImage: string;
  email: string;
  twitter: string;
  instagram: string;
}
interface IDAppListParams {
  dappName?: string; //not required
  categories?: Array<string>; //not required
}

interface IDappListData {
  dappName: string;
  dappId: string;
  icon: string;
  category: string;
  link: string;
  secondLevelDomain: string;
  supportsApply: boolean;
}

interface IRankingParams {
  dappName: string;
  keyword?: string;
  sorting?: string; //not required，default：DESC。value：ASC;DESC
  skipCount: number; // required
  maxResultCount: number; // required
}

interface IRankingData {
  rank?: number;
  domain: string;
  address: string;
  symbol: string;
  followerNumber: number;
  updateTime: number;
  rate: number;
  firstSymbolAmount: number;
  secondSymbolAmount: number;
  thirdSymbolAmount: number;
  fourSymbolAmount: number;
  fiveSymbolAmount: number;
  sixSymbolAmount: number;
  sevenSymbolAmount: number;
  eightSymbolAmount: number;
  nineSymbolAmount: number;
  inviteFollowersNumber: number;
  inviteRate: number;
  thirdFollowersNumber: number;
  thirdRate: number;
}

interface IRankingRes {
  totalCount: number;
  items: IRankingData[];
}

interface IRankingDetailParams {
  dappName: string;
  domain: string;
}

interface IRankingDetail {
  domain: string;
  dappName: string;
  describe: string;
  icon: string;
  pointDetails: Array<IPointDetail>;
}

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

interface ISocialMedia {
  icon: string;
  link: string;
  type: string;
  name: string;
}

interface IConfigItems {
  networkType: string;
  networkTypeV2: string;
  connectUrlV2: string;
  portkeyServerV2: string;
  graphqlServerV2: string;
  curChain: Chain;
  rpcUrlAELF: string;
  rpcUrlTDVW: string;
  rpcUrlTDVV: string;
  socialMediaList?: ISocialMedia[];
  mainCaAddress: string;
  sideCaAddress: string;
  mainPointsAddress: string;
  sidePointsAddress: string;
  applyInstructions: string;
  domain: string;
}

interface IConfigResponse {
  data: IConfigItems;
}

interface IEarnListParams {
  dappName: string;
  role: number;
  sorting?: string;
  skipCount: number;
  maxResultCount: number;
  Address: string;
}
interface IEarnListResults {
  totalCount: number;
  items: Array<IEarnToken>;
}

interface IEarnToken {
  dappName: string;
  icon: string;
  domain: string;
  role: number;
  address: string;
  describe: string;
  firstSymbolAmount: number;
  secondSymbolAmount: number;
  thirdSymbolAmount: number;
  fourSymbolAmount: number;
  fiveSymbolAmount: number;
  sixSymbolAmount: number;
  sevenSymbolAmount: number;
  eightSymbolAmount: number;
  nineSymbolAmount: number;
  inviteFollowersNumber: number;
  inviteRate: number;
  thirdFollowersNumber: number;
  thirdRate: number;
}
