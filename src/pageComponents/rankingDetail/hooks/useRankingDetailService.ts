import { useRequest } from 'ahooks';
import { fetchRankingDetail } from 'api/rankingApi';
import { useMount } from 'react-use';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import useLoading from 'hooks/useLoading';

export function useRankingDetailService() {
  const { data, run, loading } = useRequest(fetchRankingDetail, {
    manual: true,
  });

  const searchParams = useSearchParams();
  const dappName = searchParams.get('dappName');
  const domain = searchParams.get('domain');
  const { showLoading, closeLoading } = useLoading();

  useEffect(() => {
    if (loading) {
      showLoading();
    } else {
      closeLoading();
    }
  }, [closeLoading, loading, showLoading]);

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
