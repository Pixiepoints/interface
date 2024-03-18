import { Col, Row } from 'antd';
import { Input, Button } from 'aelf-design';
import { useResponsive } from 'hooks/useResponsive';
import { RankingTable } from './comps/RankingTable';
import { useRankingService } from './hooks/useRankingService';
import CommonSelect from 'components/CommonSelect';
import { useMemo } from 'react';
import { ReactComponent as SearchIcon } from 'assets/images/icon-search.svg';
import { ReloadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import styles from './style.module.css';

export enum sortType {
  'firstSymbolAmount' = 'FirstSymbolAmount',
  'secondSymbolAmount' = 'SecondSymbolAmount',
  'fiveSymbolAmount' = 'FiveSymbolAmount',
}

export default function RankingPage() {
  const router = useRouter();
  const { isMD } = useResponsive();
  const {
    dappList,
    rankList,
    totalCount,
    loading,
    dappName,
    setDappName,
    setKeyWord,
    onRefresh,
    setSortField,
    setFieldOrder,
    currentPage,
    currentPageSize,
    setCurrentPage,
    setCurrentPageSize,
  } = useRankingService();

  const renderDappListOptions = useMemo(() => {
    return dappList?.map((item) => ({
      value: item.dappId,
      label: (
        <Row gutter={[24, 0]} align="middle">
          <Col className="hidden md:block">
            <img src={item.icon} className="w-[40px] h-[40px] rounded-sm" width={40} height={40} />
          </Col>
          <Col className="text-base text-neutralPrimar font-medium">{item.dappName}</Col>
        </Row>
      ),
    }));
  }, [dappList]);

  return (
    <section className="flex flex-col max-w-[1360px] mx-auto px-4">
      <h1 className="flex justify-between items-center my-8 md:my-12  font-semibold text-4xl text-neutralTitle">
        <span>Ranking</span>
        {!isMD ? null : (
          <div className={clsx('-mr-7', styles.refresh)}>
            <Button type="link" icon={<ReloadOutlined />} onClick={onRefresh}>
              Refresh
            </Button>
          </div>
        )}
      </h1>
      <div className={`flex items-center gap-x-4 ${isMD ? 'sticky top-[60px] left-0' : ''}`}>
        <div className="flex-1 md:min-w-[280px]">
          <CommonSelect subfix="dApp" options={renderDappListOptions} onChange={setDappName} value={dappName} />
        </div>
        <div className="flex-1 md:min-w-[280px]">
          <Input
            className="h-12 md:!h-16 rounded-sm"
            placeholder="Search customised link or wallet address"
            prefix={<SearchIcon className="w-[18px] h-[18px]" />}
            onChange={(e) => {
              const value = (e?.nativeEvent?.target as HTMLInputElement)?.value || '';
              setKeyWord(value);
            }}></Input>
        </div>

        {isMD ? null : (
          <div className={clsx('flex-1 flex justify-end', styles.refresh)}>
            <Button type="link" icon={<ReloadOutlined />} loading={loading} onClick={onRefresh}>
              Refresh
            </Button>
          </div>
        )}
      </div>

      <RankingTable
        dataSource={rankList}
        loading={loading}
        totalCount={totalCount}
        pagination={{
          current: currentPage,
          pageSize: currentPageSize,
        }}
        onClickRow={(record) => {
          router.push(`/ranking-detail?dappName=${dappName}&domain=${record.domain}`);
        }}
        onChange={({ page, pageSize, field, order }) => {
          page && setCurrentPage(page);
          pageSize && setCurrentPageSize(pageSize);
          setFieldOrder(order);
          setSortField(sortType[field] || sortType.firstSymbolAmount);
        }}
      />
    </section>
  );
}
