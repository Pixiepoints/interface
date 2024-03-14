'use client';
import React, { useEffect, Suspense } from 'react';
import { Layout as AntdLayout } from 'antd';
import Header from 'components/Header';
import Footer from 'components/Footer';
import dynamic from 'next/dynamic';

import { store } from 'redux/store';
import { setIsMobile } from 'redux/reducer/info';
import isMobile from 'utils/isMobile';
import { useWalletInit } from 'hooks/useWallet';

const Layout = dynamic(async () => {
  const { WebLoginState, useWebLogin, useCallContract, WebLoginEvents, useWebLoginEvent } = await import(
    'aelf-web-login'
  ).then((module) => module);

  return (props: React.PropsWithChildren<{}>) => {
    const { children } = props;
    useWalletInit();
    useEffect(() => {
      const resize = () => {
        const ua = navigator.userAgent;
        const mobileType = isMobile(ua);
        const isMobileDevice =
          mobileType.apple.phone || mobileType.android.phone || mobileType.apple.tablet || mobileType.android.tablet;
        store.dispatch(setIsMobile(isMobileDevice));
      };
      resize();
      window.addEventListener('resize', resize);
      return () => {
        window.removeEventListener('resize', resize);
      };
    }, []);

    return (
      <>
        <AntdLayout>
          <Header />
          <AntdLayout.Content className="main-content">
            <Suspense>{children}</Suspense>
          </AntdLayout.Content>
          <Footer />
        </AntdLayout>
      </>
    );
  };
});

export default Layout;
