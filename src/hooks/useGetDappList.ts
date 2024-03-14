import { useRequest } from 'ahooks';
import { IDappListParams } from 'types/dapp';
import { useMemo } from 'react';
import { fetchDAppList } from 'api/homeApi';

export default function useGetDappList(params?: IDappListParams) {
  const { data } = useRequest(() => fetchDAppList(params));
  return useMemo(() => data, [data]);
}
