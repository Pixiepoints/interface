import { useRequest, useMount } from 'ahooks';
import { fetchDAppList } from 'api/homeApi';

export function useHomeLogicService() {
  const { data, run, loading } = useRequest(fetchDAppList, {
    manual: true,
    debounceWait: 500,
    debounceLeading: true,
  });

  useMount(() => {
    run({
      dappName: '',
    });
  });

  const onSearch = (keyWord: string) => {
    run({
      dappName: keyWord.trim(),
    });
  };

  return {
    dAppList: data,
    loading,
    onSearch,
  };
}
