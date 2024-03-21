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
import { useCallback, useEffect, useRef, useState } from 'react';
import { useGetToken } from './useGetToken';
import { getOriginalAddress } from 'utils/addressFormatting';
import { dispatch, store } from 'redux/store';
import { setWalletInfo } from 'redux/reducer/userInfo';
import { useLocalStorage } from 'react-use';
import { cloneDeep } from 'lodash-es';
import { WalletInfoType } from 'types';
import { storages } from 'storages';
import { useRegisterContractServiceMethod } from 'contract/baseContract';
import useBackToHomeByRoute from './useBackToHomeByRoute';
import { useSelector } from 'react-redux';
import { ChainId } from '@portkey/types';
import useDiscoverProvider from './useDiscoverProvider';
import { MethodsWallet } from '@portkey/provider-types';
import { getConfig, setHasToken, setItemsFromLocal } from 'redux/reducer/info';
import useGetStoreInfo from 'redux/hooks/useGetStoreInfo';

export const useWalletInit = () => {
  const [, setLocalWalletInfo] = useLocalStorage<WalletInfoType>(storages.walletInfo);
  const getAccountInAELF = useGetAccount('AELF');

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
  }, [backToHomeByRoute]);

  useWebLoginEvent(WebLoginEvents.LOGIN_ERROR, (error) => {
    message.error(`${error.message || 'LOGIN_ERROR'}`);
  });
  useWebLoginEvent(WebLoginEvents.LOGINED, () => {
    console.log('log in');
    // message.success('log in');
  });

  useWebLoginEvent(WebLoginEvents.LOGOUT, () => {
    resetAccount();
  });
  useWebLoginEvent(WebLoginEvents.USER_CANCEL, () => {
    console.log('user cancel');
    // message.error('user cancel');
  });

  useWebLoginEvent(WebLoginEvents.DISCOVER_DISCONNECTED, () => {
    logout();
  });
};

export const useWalletService = () => {
  const { login, logout, loginState, walletType, wallet } = useWebLogin();
  const { lock } = usePortkeyLock();
  const isLogin = loginState === WebLoginState.logined;
  return { login, logout, isLogin, walletType, lock, wallet };
};

// Example Query whether the synchronization of the main sidechain is successful
export const useWalletSyncCompleted = (contractChainId = 'AELF') => {
  const loading = useRef<boolean>(false);
  const info = useSelector(getConfig);
  const getAccountInAELF = useGetAccount('AELF');
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
  }, [walletInfo, getAccountInAELF, setLocalWalletInfo]);

  const getTargetChainAddress = useCallback(async () => {
    if (contractChainId === 'AELF') {
      return await getAccount();
    } else {
      loading.current = false;
      return wallet.address;
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
    walletType,
    walletInfo.aelfChainAddress,
    wallet.portkeyInfo,
    contractChainId,
    getTargetChainAddress,
    did.didWallet,
    discoverProvider,
  ]);
  return { getAccountInfoSync };
};

export const useCheckLoginAndToken = () => {
  const { loginState, login } = useWebLogin();
  const isLogin = loginState === WebLoginState.logined;
  const { getToken } = useGetToken();
  const { hasToken } = useGetStoreInfo();

  const checkLogin = async () => {
    const accountInfo = JSON.parse(localStorage.getItem(storages.accountInfo) || '{}');
    if (isLogin) {
      if (accountInfo.token) {
        store.dispatch(setHasToken(true));
        return;
      }
      getToken();
    }
    login();
  };

  useEffect(() => {
    const accountInfo = JSON.parse(localStorage.getItem(storages.accountInfo) || '{}');
    if (accountInfo.token) {
      store.dispatch(setHasToken(true));
      return;
    }
  }, []);

  return {
    isOK: isLogin && !!hasToken,
    checkLogin,
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
