'use client';
import StoreProvider from './store';
import { AELFDProvider } from 'aelf-design';
import WebLoginProvider from './webLoginProvider';

import { useEffect, useState } from 'react';
import Loading from 'components/PageLoading';
import NiceModal from '@ebay/nice-modal-react';
import { AELFDProviderTheme } from './config';
import { fetchConfigItems } from 'api/request';
import { message } from 'antd';
import { store } from 'redux/store';
import { setConfig } from 'redux/reducer/info';

function Provider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  const storeConfig = async () => {
    const data = await fetchConfigItems();
    store.dispatch(setConfig(data));

    setLoading(false);
  };
  useEffect(() => {
    storeConfig();
    message.config({
      maxCount: 1,
    });
  }, []);

  return (
    <>
      <StoreProvider>
        <AELFDProvider theme={AELFDProviderTheme}>
          {loading ? (
            <Loading></Loading>
          ) : (
            <WebLoginProvider>
              <NiceModal.Provider>{children}</NiceModal.Provider>
            </WebLoginProvider>
          )}
        </AELFDProvider>
      </StoreProvider>
    </>
  );
}

export default Provider;
