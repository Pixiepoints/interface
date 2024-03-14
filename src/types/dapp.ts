export type DappType = {
  dappName: string;
  icon: string;
  category: string;
  link: string;
  secondLevelDomain: string;
};

export interface IDappListParams {
  dappName?: string;
  categories?: string[];
}

export type IDappListResults = Array<DappType>;
