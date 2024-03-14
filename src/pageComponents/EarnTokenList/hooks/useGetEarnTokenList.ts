import { useAsyncFn } from 'react-use';
import { IEarnListParams, IEarnListResults } from 'types/earnToke';
import request from 'api/axios';
import { useMemo } from 'react';

export default function useGetEarnTokenList() {
  const [{ value, loading }, callback] = useAsyncFn(async (params: IEarnListParams) => {
    return await request.post<IEarnListParams, IEarnListResults>('app/points/earned/list', params);
  }, []);

  return useMemo(() => [{ tokenList: value, loading }, { getEarnTokenList: callback }], [value, callback, loading]);
}
