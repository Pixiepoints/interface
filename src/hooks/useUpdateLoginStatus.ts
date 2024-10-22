import { useEffect, useMemo } from 'react';
import { setLoginStatus } from 'redux/reducer/loginStatus';
import { dispatch } from 'redux/store';
import { storages } from 'storages';
import { useGetToken } from './useGetToken';
import { useWebLogin, WebLoginState } from 'aelf-web-login';

const useUpdateLoginStatus = () => {
  const { loginState, wallet: walletInfo } = useWebLogin();
  const { checkTokenValid } = useGetToken();

  const isConnectWallet = useMemo(() => {
    return loginState === WebLoginState.logined;
  }, [loginState]);

  useEffect(() => {
    const accountInfo = JSON.parse(localStorage.getItem(storages.accountInfo) || '{}');
    const hasLocalToken = !!accountInfo.token && checkTokenValid();
    dispatch(
      setLoginStatus({
        isConnectWallet,
        hasToken: hasLocalToken,
        isLogin: isConnectWallet && walletInfo && hasLocalToken,
      }),
    );
  }, [checkTokenValid, isConnectWallet, walletInfo]);
};

export default useUpdateLoginStatus;
