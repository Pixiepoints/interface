export type InfoStateType = {
  isMobile?: boolean;
  theme: string | undefined | null;
  config?: IConfigItems;
  itemsFromLocal?: string[];
  hasToken?: boolean;
};

export type TLoginStatusType = {
  loginStatus: {
    isConnectWallet: boolean;
    hasToken: boolean;
    isLogin: boolean;
    isLoadingToken: boolean;
    isLoadingConnectWallet: boolean;
  };
};
