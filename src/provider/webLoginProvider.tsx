'use client';
import { NetworkType } from '@portkey/provider-types';
import { appName } from 'constants/common';
import dynamic from 'next/dynamic';
import { store } from 'redux/store';

const APP_NAME = appName;

const PortkeyProviderDynamic = dynamic(
  async () => {
    const weblogin = await import('aelf-web-login').then((module) => module);
    return weblogin.PortkeyProvider;
  },
  { ssr: false },
) as any;

const WebLoginProviderDynamic = dynamic(
  async () => {
    const info = store.getState().info.config;
    const serverV2 = info.portkeyServerV2;
    const connectUrlV2 = info.connectUrlV2;

    const webLogin = await import('aelf-web-login').then((module) => module);

    console.log('=====info', info);

    webLogin.setGlobalConfig({
      onlyShowV2: true,
      appName: APP_NAME,
      chainId: info.curChain || '',
      portkey: {},
      portkeyV2: {
        networkType: (info.networkTypeV2 || 'TESTNET') as NetworkType,
        useLocalStorage: true,
        graphQLUrl: info.graphqlServerV2,
        connectUrl: connectUrlV2 || '',
        requestDefaults: {
          timeout: info.networkTypeV2 === 'TESTNET' ? 300000 : 80000,
          baseURL: serverV2 || '',
        },
        serviceUrl: serverV2,
        referralInfo: {
          referralCode: '',
          projectCode: '13023',
        },
      },
      aelfReact: {
        appName: APP_NAME,
        nodes: {
          AELF: {
            chainId: 'AELF',
            rpcUrl: info.rpcUrlAELF as unknown as string,
          },
          tDVW: {
            chainId: 'tDVW',
            rpcUrl: info.rpcUrlTDVW as unknown as string,
          },
          tDVV: {
            chainId: 'tDVV',
            rpcUrl: info.rpcUrlTDVV as unknown as string,
          },
        },
      },
      defaultRpcUrl:
        (info?.[`rpcUrl${String(info.curChain).toUpperCase()}`] as unknown as string) || info.rpcUrlTDVW || '',
      networkType: (info.networkType as 'TESTNET' | 'MAIN') || 'TESTNET',
    });
    return webLogin.WebLoginProvider;
  },
  { ssr: false },
);

export default ({ children }: { children: React.ReactNode }) => {
  const info = store.getState().info.config;
  return (
    <PortkeyProviderDynamic networkType={info.networkType} networkTypeV2={info.networkTypeV2}>
      <WebLoginProviderDynamic
        nightElf={{
          useMultiChain: true,
          connectEagerly: true,
        }}
        portkey={{
          autoShowUnlock: false,
          checkAccountInfoSync: true,
          design: 'CryptoDesign',
          keyboard: {
            v2: true,
          },
        }}
        extraWallets={['discover', 'elf']}
        discover={{
          autoRequestAccount: true,
          autoLogoutOnDisconnected: true,
          autoLogoutOnNetworkMismatch: true,
          autoLogoutOnAccountMismatch: true,
          autoLogoutOnChainMismatch: true,
        }}>
        {children}
      </WebLoginProviderDynamic>
    </PortkeyProviderDynamic>
  );
};
