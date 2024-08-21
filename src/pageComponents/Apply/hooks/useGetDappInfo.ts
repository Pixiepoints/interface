import { fetchDAppList } from 'api/homeApi';
import { useCallback, useEffect, useState } from 'react';

export const useGetDappInfo = (dappName: string) => {
  const [dappInfo, setDappInfo] = useState<IDappListData>();
  const getDappInfo = useCallback(async () => {
    try {
      const res = await fetchDAppList({
        dappName,
      });
      setDappInfo(res[0]);
    } catch (error) {
      setDappInfo(undefined);
    }
  }, [dappName]);

  useEffect(() => {
    getDappInfo();
  }, [getDappInfo]);

  return { dappInfo, getDappInfo };
};
