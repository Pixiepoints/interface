import { useRequest } from 'ahooks';
import { fetchRankingList } from 'api/rankingApi';
import { useEffect, useMemo, useState } from 'react';
import useGetDappList from 'hooks/useGetDappList';
import { sortType } from '..';
import { decodeAddress, getOriginalAddress } from 'utils/addressFormatting';

export function useRankingService() {
  const { data, run, loading } = useRequest(fetchRankingList, {
    debounceWait: 300,
    debounceLeading: true,
    manual: true,
    pollingInterval: 1000 * 60,
  });

  const dappList = useGetDappList({ dappName: '' });

  const [dappName, setDappName] = useState<string>('');
  const [keyword, setKeyWord] = useState<string>('');
  const [currentPageSize, setCurrentPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<string>(sortType.firstSymbolAmount);
  const [fieldOrder, setFieldOrder] = useState<string>();

  const onSearch = () => {
    const pageNumber = currentPageSize;
    const sortOption = !fieldOrder
      ? { sortingKeyWord: sortField }
      : { sortingKeyWord: sortField, sorting: String(fieldOrder).replace('end', '').toUpperCase() };
    const pagination = {
      skipCount: (currentPage - 1) * pageNumber,
      maxResultCount: pageNumber,
    };
    const searchOpt = { dappName, keyword };
    if (!searchOpt.dappName) return;
    const params = Object.assign({}, sortOption, pagination, searchOpt);
    if (!params.keyword) delete params.keyword;
    if (params.keyword) {
      if (decodeAddress(params.keyword)) {
        params.keyword = getOriginalAddress(params.keyword);
      }
      params.skipCount = 0;
    }
    run(params);
  };

  const onRefresh = () => {
    onSearch();
  };

  useEffect(() => {
    onSearch();
  }, [keyword, dappName, currentPageSize, currentPage, fieldOrder]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortField]);

  const rankList = useMemo(() => {
    return data?.items.map((item, index) => {
      item.rank = (currentPage - 1) * currentPageSize + index + 1;
      return item;
    });
  }, [data]);

  useEffect(() => {
    dappList?.length && setDappName(dappList[0].dappId);
  }, [dappList]);

  return {
    dappList,
    rankList,
    totalCount: data?.totalCount,
    loading,
    setKeyWord,
    dappName,
    setDappName,
    onSearch,
    onRefresh,
    setFieldOrder,
    setSortField,
    currentPage,
    setCurrentPage,
    currentPageSize,
    setCurrentPageSize,
  };
}
