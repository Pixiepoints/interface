import {
  useWebLogin,
  WebLoginState,
  WebLoginEvents,
  useWebLoginEvent,
  useLoginState,
  WalletType,
  useGetAccount,
  usePortkeyLock,
  useComponentFlex,
  PortkeyInfo,
} from 'aelf-web-login';
import { message } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGetToken } from './useGetToken';
import { getOriginalAddress } from 'utils/addressFormatting';
import { dispatch, store } from 'redux/store';
import { setWalletInfo } from 'redux/reducer/userInfo';
import { useLocalStorage } from 'react-use';
import { cloneDeep } from 'lodash-es';
import { WalletInfoType } from 'types';
import { storages } from 'storages';
import useBackToHomeByRoute from './useBackToHomeByRoute';
import { useSelector } from 'react-redux';
import { ChainId } from '@portkey/types';
import useDiscoverProvider from './useDiscoverProvider';
import { MethodsWallet } from '@portkey/provider-types';
import { getConfig, setHasToken, setItemsFromLocal } from 'redux/reducer/info';
import useGetStoreInfo from 'redux/hooks/useGetStoreInfo';
import { mainChain } from 'constants/index';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { resetLoginStatus, setLoginStatus } from 'redux/reducer/loginStatus';

export const useWalletInit = () => {
  const [, setLocalWalletInfo] = useLocalStorage<WalletInfoType>(storages.walletInfo);
  const getAccountInAELF = useGetAccount(mainChain);

  const { getToken } = useGetToken();
  const { wallet, walletType } = useWebLogin();

  const backToHomeByRoute = useBackToHomeByRoute();

  const { logout } = useWalletService();

  // register Contract method
  // useRegisterContractServiceMethod();
  const callBack = useCallback(
    (state: WebLoginState) => {
      if (state === WebLoginState.lock) {
        backToHomeByRoute();
      }
      if (state === WebLoginState.logined) {
        const walletInfo: WalletInfoType = {
          address: wallet?.address || '',
          publicKey: wallet?.publicKey,
          aelfChainAddress: '',
        };
        if (walletType === WalletType.elf) {
          walletInfo.aelfChainAddress = wallet?.address || '';
        }
        if (walletType === WalletType.discover) {
          walletInfo.discoverInfo = {
            accounts: wallet.discoverInfo?.accounts || {},
            address: wallet.discoverInfo?.address || '',
            nickName: wallet.discoverInfo?.nickName,
          };
        }
        if (walletType === WalletType.portkey) {
          walletInfo.portkeyInfo = wallet.portkeyInfo as PortkeyInfo;
        }
        getToken();
        dispatch(setWalletInfo(cloneDeep(walletInfo)));
        setLocalWalletInfo(cloneDeep(walletInfo));
      }
    },
    [getAccountInAELF, getToken, walletType, wallet, setLocalWalletInfo],
  );

  useLoginState(callBack);

  const resetAccount = useCallback(() => {
    backToHomeByRoute();
    localStorage.removeItem(storages.accountInfo);
    localStorage.removeItem(storages.walletInfo);
    localStorage.removeItem(storages.pubKey);
    dispatch(
      setWalletInfo({
        address: '',
        aelfChainAddress: '',
      }),
    );
    dispatch(setItemsFromLocal([]));
    dispatch(setHasToken(false));
    dispatch(resetLoginStatus());
  }, [backToHomeByRoute]);

  useWebLoginEvent(WebLoginEvents.LOGIN_ERROR, (error) => {
    message.error(`${error.message || 'LOGIN_ERROR'}`);
  });
  useWebLoginEvent(WebLoginEvents.LOGINED, () => {
    console.info('log in');
  });

  useWebLoginEvent(WebLoginEvents.LOGOUT, () => {
    resetAccount();
  });
  useWebLoginEvent(WebLoginEvents.USER_CANCEL, () => {
    console.info('user cancel');
  });

  useWebLoginEvent(WebLoginEvents.DISCOVER_DISCONNECTED, () => {
    console.info('Your account has been logged out');
    logout();
  });
};

export const useWalletService = () => {
  const { login, logout, loginState, walletType, wallet } = useWebLogin();
  const { isLogin } = useGetLoginStatus();
  const { lock } = usePortkeyLock();
  return { login, logout, isLogin, walletType, lock, wallet };
};

// Example Query whether the synchronization of the main sidechain is successful
export const useWalletSyncCompleted = (contractChainId: ChainId = mainChain) => {
  const loading = useRef<boolean>(false);
  const info = useSelector(getConfig);
  const getAccountInAELF = useGetAccount(mainChain);
  const { wallet, walletType } = useWebLogin();
  // console.log(walletType, wallet, 'walletType');
  const { walletInfo } = cloneDeep(useSelector((store: any) => store.userInfo));
  const [, setLocalWalletInfo] = useLocalStorage<WalletInfoType>(storages.walletInfo);
  const { discoverProvider } = useDiscoverProvider();
  const errorFunc = () => {
    message.error('Synchronising data on the blockchain. Please wait around 3 minutes.');
    loading.current = false;
    return '';
  };

  const { did } = useComponentFlex();

  const getAccount = useCallback(async () => {
    try {
      const aelfChainAddress = await getAccountInAELF();

      walletInfo.aelfChainAddress = getOriginalAddress(aelfChainAddress);

      dispatch(setWalletInfo(walletInfo));
      loading.current = false;
      if (!aelfChainAddress) {
        return errorFunc();
      } else {
        return walletInfo.aelfChainAddress;
      }
    } catch (error) {
      return errorFunc();
    }
  }, [walletInfo, getAccountInAELF]);

  const getTargetChainAddress = useCallback(async () => {
    try {
      if (contractChainId === mainChain) {
        return await getAccount();
      } else {
        loading.current = false;
        return wallet.address;
      }
    } catch (error) {
      return errorFunc();
    }
  }, [contractChainId, getAccount, wallet.address]);

  const getAccountInfoSync = useCallback(async () => {
    if (loading.current) return '';
    let caHash;
    let address: any;
    if (walletType === WalletType.elf) {
      return walletInfo.aelfChainAddress;
    }
    if (walletType === WalletType.portkey) {
      loading.current = true;
      const didWalletInfo = wallet.portkeyInfo;
      caHash = didWalletInfo?.caInfo?.caHash;
      address = didWalletInfo?.walletInfo?.address;
      // PortkeyOriginChainId register network address
      const originChainId = didWalletInfo?.chainId;
      if (originChainId === contractChainId) {
        return await getTargetChainAddress();
      }
      try {
        const holder = await did.didWallet.getHolderInfoByContract({
          chainId: contractChainId as ChainId,
          caHash: caHash as string,
        });
        const filteredHolders = holder.managerInfos.filter((manager: any) => manager?.address === address);
        if (filteredHolders.length) {
          return await getTargetChainAddress();
        } else {
          return errorFunc();
        }
      } catch (error) {
        return errorFunc();
      }
    } else {
      loading.current = true;
      try {
        const provider = await discoverProvider();
        const status = await provider?.request({
          method: MethodsWallet.GET_WALLET_MANAGER_SYNC_STATUS,
          payload: { chainId: contractChainId },
        });
        if (status) {
          return await getTargetChainAddress();
        } else {
          return errorFunc();
        }
      } catch (error) {
        return errorFunc();
      }
    }
  }, [
    contractChainId,
    did.didWallet,
    discoverProvider,
    getTargetChainAddress,
    wallet.portkeyInfo,
    walletInfo.aelfChainAddress,
    walletType,
  ]);
  return { getAccountInfoSync };
};

export const useCheckLoginAndToken = () => {
  const { loginState, login, wallet, logout } = useWebLogin();
  const { getToken, checkTokenValid } = useGetToken();
  const success = useRef<<T = any>() => T | void>();
  const { isLogin } = useGetLoginStatus();

  const isConnectWallet = useMemo(() => {
    return loginState === WebLoginState.logined;
  }, [loginState]);

  const checkLogin = async (params?: { onSuccess?: <T = any>() => T | void }) => {
    const { onSuccess } = params || {};
    const accountInfo = JSON.parse(localStorage.getItem(storages.accountInfo) || '{}');
    if (isConnectWallet && wallet) {
      if (accountInfo.token && checkTokenValid()) {
        store.dispatch(
          setLoginStatus({
            hasToken: true,
            isLogin: true,
          }),
        );
        return;
      }
      await getToken({
        needLoading: true,
      });
      onSuccess && onSuccess();
      return;
    }
    success.current = onSuccess;
    login();
  };

  useEffect(() => {
    if (isLogin) {
      success.current && success.current();
      success.current = undefined;
    }
  }, [isLogin]);

  useEffect(() => {
    const accountInfo = JSON.parse(localStorage.getItem(storages.accountInfo) || '{}');
    if (accountInfo.token) {
      store.dispatch(
        setLoginStatus({
          hasToken: true,
        }),
      );
      return;
    }
  }, []);

  return {
    checkTokenValid,
    checkLogin,
    logout,
    isOK: isLogin,
  };
};

type CallBackType = () => void;

export const useElfWebLoginLifeCircleHookService = () => {
  const { login } = useWebLogin();

  const [hooksMap, setHooksMap] = useState<{
    [key in WebLoginState]?: CallBackType[];
  }>({});

  const registerHook = (name: WebLoginState, callBack: CallBackType) => {
    const hooks = (hooksMap[name] || []).concat(callBack);
    setHooksMap({
      ...hooksMap,
      [name]: hooks,
    });
  };

  useWebLoginEvent(WebLoginEvents.LOGINED, async () => {
    const hooks = hooksMap[WebLoginState.logined];
    if (hooks?.length) {
      for (let i = 0; i < hooks.length; ++i) {
        console.log(`await hooks ${i} execute`);
        await hooks[i]();
      }
    }
  });

  return {
    login,
    registerHook,
  };
};
