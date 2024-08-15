import { useRequest } from 'ahooks';
import { IDappListParams } from 'types/dapp';
import { useEffect, useMemo } from 'react';
import { fetchDAppList } from 'api/homeApi';

export default function useGetDappList(params?: IDappListParams) {
  const { data, run } = useRequest(() => fetchDAppList(params), { manual: true });

  useEffect(() => {
    run();
  }, [run]);

  return useMemo(() => (data || []).filter((itm) => itm.supportsApply), [data]);
}
