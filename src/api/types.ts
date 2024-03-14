export interface IApplyCheckParams {
  dappName: string;
  domain: string;
  address: string;
}

export interface IApplyConfirmParams {
  rawTransaction: string;
  describe: string;
  publicKey: string;
  chainId: Chain;
}
