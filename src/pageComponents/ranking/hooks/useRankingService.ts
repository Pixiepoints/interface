import { useRequest } from 'ahooks';
import { fetchRankingList } from 'api/rankingApi';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useGetDappList from 'hooks/useGetDappList';
import { decodeAddress, getOriginalAddress } from 'utils/addressFormatting';

export function useRankingService() {
  const { data, run, loading } = useRequest(fetchRankingList, {
    manual: true,
    pollingInterval: 1000 * 60,
  });

  const dappList = useGetDappList({ dappName: '' });

  const [dappName, setDappName] = useState<string>('');
  const [currentPageSize, setCurrentPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<string>();
  const [fieldOrder, setFieldOrder] = useState<string>();
  const keyWorld = useRef<string>('');

  const selectValue = useMemo(() => {
    return dappList?.filter((item) => item?.dappId === dappName)?.[0];
  }, [dappList, dappName]);

  const defaultSortField = useMemo(() => {
    return (
      selectValue?.rankingColumns?.find((item) => !!item?.defaultSortOrder)?.sortingKeyWord ||
      selectValue?.rankingColumns?.[0]?.sortingKeyWord ||
      ''
    );
  }, [selectValue?.rankingColumns]);

  const totalCount = useMemo(() => {
    const total = data?.totalCount || 0;
    return total > 10000 ? 10000 : total;
  }, [data?.totalCount]);

  const onSearch = useCallback(() => {
    const pageNumber = currentPageSize;
    const sortOption = !fieldOrder
      ? { sortingKeyWord: sortField || defaultSortField }
      : { sortingKeyWord: sortField || defaultSortField, sorting: String(fieldOrder).replace('end', '').toUpperCase() };
    const pagination = {
      skipCount: (currentPage - 1) * pageNumber,
      maxResultCount: pageNumber,
    };
    const searchOpt = { dappName, keyword: keyWorld.current };
    if (!searchOpt.dappName) return;
    const params = Object.assign({}, sortOption, pagination, searchOpt);
    if (!params.keyword) delete params.keyword;
    if (params.keyword) {
      if (decodeAddress(params.keyword)) {
        params.keyword = getOriginalAddress(params.keyword);
      }
    }
    run(params);
  }, [currentPage, currentPageSize, dappName, defaultSortField, fieldOrder, run, sortField]);

  const onRefresh = useCallback(() => {
    onSearch();
  }, [onSearch]);

  const onKeywordUpdate = useCallback(
    (value: string) => {
      keyWorld.current = value;
      if (currentPage === 1) {
        onRefresh();
      } else {
        setCurrentPage(1);
      }
    },
    [currentPage, onRefresh],
  );

  useEffect(() => {
    onSearch();
  }, [onSearch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortField]);

  const rankList = useMemo(() => {
    return data?.items.map((item, index) => {
      item.rank = (currentPage - 1) * currentPageSize + index + 1;
      return item;
    });
  }, [currentPage, currentPageSize, data?.items]);

  useEffect(() => {
    dappList?.length && setDappName(dappList[0].dappId);
  }, [dappList]);

  const pointsColumns = useMemo(() => {
    return selectValue?.rankingColumns?.map((item) => {
      return {
        dataIndex: item?.dataIndex,
        title: item?.label || '',
        defaultSortOrder: item?.defaultSortOrder || undefined,
        tipText: item?.tipText,
        supportsSelfIncrease: item?.supportsSelfIncrease,
      };
    });
  }, [selectValue?.rankingColumns]);

  const onChange = useCallback(
    ({ field, order }) => {
      setFieldOrder(order);
      const sortField = selectValue?.rankingColumns?.find((item) => item?.dataIndex === field)?.sortingKeyWord;
      setSortField(sortField || defaultSortField);
    },
    [defaultSortField, selectValue?.rankingColumns],
  );

  useEffect(() => {
    if (dappName) {
      setSortField(undefined);
      setFieldOrder(undefined);
      setCurrentPage(1);
    }
  }, [dappName]);

  return {
    dappList,
    rankList,
    totalCount,
    loading,
    setKeyWord: onKeywordUpdate,
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
    selectValue,
    pointsColumns,
    onChange,
  };
}
