import { store } from 'redux/store';
import { SupportedELFChainId } from 'types';

enum ENVIRONMENT {
  TEST = 'test',
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

const env = process.env.NEXT_PUBLIC_APP_ENV as unknown as ENVIRONMENT;

const explorerUrls = {
  [ENVIRONMENT.TEST]: {
    AELF: 'https://explorer-test.aelf.io/',
    TDVV: 'https://explorer-test-side02.aelf.io/',
    TDVW: 'https://explorer-test-side02.aelf.io/',
  },
  [ENVIRONMENT.DEVELOPMENT]: {
    AELF: 'https://explorer-test.aelf.io/',
    TDVV: 'https://explorer-test-side02.aelf.io/',
    TDVW: 'https://explorer-test-side02.aelf.io/',
  },
  [ENVIRONMENT.PRODUCTION]: {
    AELF: 'https://explorer.aelf.io/',
    TDVV: 'https://tdvv-explorer.aelf.io/',
    TDVW: 'https://tdvv-explorer.aelf.io/',
  },
};

export const EXPLORE_URL = {
  AELF: explorerUrls[env].AELF,
  TDVV: explorerUrls[env].TDVV,
  TDVW: explorerUrls[env].TDVW,
};

export const getRpcUrls = () => {
  const info = store.getState().info.config;

  return {
    [SupportedELFChainId.MAIN_NET]: info?.rpcUrlAELF,
    [SupportedELFChainId.TDVV_NET]: info?.rpcUrlTDVV,
    [SupportedELFChainId.TDVW_NET]: info?.rpcUrlTDVW,
  };
};
