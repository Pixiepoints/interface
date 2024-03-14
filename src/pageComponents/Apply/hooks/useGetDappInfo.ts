import { fetchDAppList } from 'api/homeApi';
import { useEffect, useState } from 'react';

export const useGetDappInfo = (dappName: string) => {
  const [dappInfo, setDappInfo] = useState<IDappListData>();
  const getDappInfo = async () => {
    try {
      const res = await fetchDAppList({
        dappName,
      });
      setDappInfo(res[0]);
    } catch (error) {
      setDappInfo(undefined);
    }
  };

  useEffect(() => {
    getDappInfo();
  }, [dappName]);

  return { dappInfo, getDappInfo };
};
