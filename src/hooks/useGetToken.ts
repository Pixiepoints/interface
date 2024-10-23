import { useWebLogin, WalletType, WebLoginState } from 'aelf-web-login';
import { useCallback, useMemo } from 'react';
import { storages } from 'storages';
import { fetchToken } from 'api/request';
import { message } from 'antd';
import useDiscoverProvider from './useDiscoverProvider';
import { appName } from 'constants/common';
import { store } from 'redux/store';
import useLoading from './useLoading';
import { resetLoginStatus, setLoginStatus } from 'redux/reducer/loginStatus';
import { sleep } from 'utils/common';

const AElf = require('aelf-sdk');

const hexDataCopywriter = `Welcome to PixiePoints! Click to connect wallet to and accept its Terms of Service and Privacy Policy. This request will not trigger a blockchain transaction or cost any gas fees.

signature: `;

export const LoginFailed = 'Login failed!';

export const useGetToken = () => {
  const {
    loginState,
    wallet,
    wallet: { address },
    getSignature,
    walletType,
    logout,
  } = useWebLogin();

  const isConnectWallet = useMemo(() => {
    return loginState === WebLoginState.logined;
  }, [loginState]);

  const { showLoading, closeLoading } = useLoading();
  const { getSignatureAndPublicKey } = useDiscoverProvider();

  const getTokenFromServer: (props: {
    params: ITokenParams;
    needLoading?: boolean;
    retryCount?: number;
  }) => Promise<string | undefined> = useCallback(
    async (props: { params: ITokenParams; needLoading?: boolean; retryCount?: number }) => {
      const { params, needLoading = false, retryCount = 3 } = props;
      needLoading && showLoading();
      try {
        const res = await fetchToken(params);
        needLoading && closeLoading();
        if (isConnectWallet && wallet) {
          store.dispatch(
            setLoginStatus({
              hasToken: true,
              isLogin: true,
            }),
          );
          localStorage.setItem(
            storages.accountInfo,
            JSON.stringify({
              account: wallet?.address || '',
              token: res.access_token,
              expirationTime: Date.now() + res.expires_in * 1000,
            }),
          );
          return res.access_token;
        } else {
          message.error(LoginFailed);
          store.dispatch(resetLoginStatus());
          return '';
        }
      } catch (error) {
        if (retryCount) {
          await sleep(1000);
          const retry = retryCount - 1;
          await getTokenFromServer({
            ...props,
            retryCount: retry,
          });
        } else {
          message.error(LoginFailed);
          isConnectWallet && logout();
          needLoading && closeLoading();
          return '';
        }
      }
    },
    [closeLoading, isConnectWallet, logout, showLoading, wallet],
  );

  const checkTokenValid = useCallback(() => {
    if (!isConnectWallet) return false;
    let accountInfo;
    try {
      accountInfo = JSON.parse(localStorage.getItem(storages.accountInfo) || '{}');
    } catch (error) {
      console.error('parse token from localStorage error', error);
      return false;
    }

    if (accountInfo?.token && Date.now() < accountInfo?.expirationTime && accountInfo.account === address) {
      return true;
    } else {
      return false;
    }
  }, [isConnectWallet, address]);

  const getToken: (params?: { needLoading?: boolean }) => Promise<undefined | string> = useCallback(
    async (params?: { needLoading?: boolean }) => {
      const { needLoading } = params || {};
      if (!isConnectWallet || !wallet) return;
      const accountInfo = JSON.parse(localStorage.getItem(storages.accountInfo) || '{}');
      if (checkTokenValid()) {
        return;
      } else {
        localStorage.removeItem(storages.accountInfo);
      }
      const timestamp = Date.now();
      const signStr = `${wallet?.address}-${timestamp}`;
      const hexDataStr = hexDataCopywriter + signStr;
      const signInfo = AElf.utils.sha256(signStr);
      const hexData = Buffer.from(hexDataStr).toString('hex');

      let publicKey = '';
      let signature = '';
      let source = '';

      if (walletType === WalletType.discover) {
        try {
          const { pubKey, signatureStr } = await getSignatureAndPublicKey(signInfo, hexData);
          publicKey = pubKey || '';
          signature = signatureStr || '';
          source = 'portkey';
        } catch (error) {
          message.error((error as Error).message);
          isConnectWallet && logout();
          return;
        }
      } else {
        const sign = await getSignature({
          appName: appName,
          address: wallet.address,
          signInfo: walletType === WalletType.portkey ? Buffer.from(signStr).toString('hex') : signInfo,
        });
        if (sign?.errorMessage) {
          message.error(sign.errorMessage);
          isConnectWallet && logout();
          return;
        }
        publicKey = wallet.publicKey || '';
        signature = sign.signature;
        if (walletType === WalletType.elf) {
          source = 'nightElf';
        } else {
          source = 'portkey';
        }
      }
      localStorage.setItem(storages.pubKey, publicKey);
      store.dispatch(setLoginStatus({ isLoadingToken: true }));
      const res = await getTokenFromServer({
        params: {
          grant_type: 'signature',
          scope: 'PointsServer',
          client_id: 'PointsServer_App',
          timestamp,
          signature,
          source,
          publickey: publicKey,
          address: wallet?.address || '',
        } as ITokenParams,
        needLoading,
      });
      store.dispatch(setLoginStatus({ isLoadingToken: false }));
      return res;
    },
    [
      isConnectWallet,
      wallet,
      checkTokenValid,
      walletType,
      getTokenFromServer,
      getSignatureAndPublicKey,
      logout,
      getSignature,
    ],
  );

  return { getToken, checkTokenValid };
};
