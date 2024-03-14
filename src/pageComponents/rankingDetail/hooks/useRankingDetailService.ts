import { useRequest } from 'ahooks';
import { fetchRankingDetail } from 'api/rankingApi';
import { useMount } from 'react-use';
import { useSearchParams } from 'next/navigation';

export function useRankingDetailService() {
  const { data, run, loading } = useRequest(fetchRankingDetail, {
    manual: true,
  });

  const searchParams = useSearchParams();
  const dappName = searchParams.get('dappName');
  const domain = searchParams.get('domain');

  useMount(() => {
    run({
      dappName: decodeURI(dappName),
      domain: decodeURI(domain),
    });
  });

  return {
    rankingDetail: data,
    loading,
  };
}
