import React from 'react';
import { Table, Tooltip, Pagination } from 'aelf-design';
import type { TableColumnsType } from 'antd';
import { ConfigProvider } from 'antd';
import { ReactComponent as QuestionIconComp } from 'assets/images/icons/questionCircleOutlined.svg';
import { EarnAmountCount } from './EarnAmountDynamic';
import CommonCopy from 'components/CommonCopy';
import { SorterResult } from 'antd/es/table/interface';
import { OmittedType, addPrefixSuffix, getOmittedStr } from 'utils/addressFormatting';
import {
  SGR_10_TOOL_TIP,
  SGR_11_TOOL_TIP,
  SGR_1_TOOL_TIP,
  SGR_2_TOOL_TIP,
  SGR_3_TOOL_TIP,
  SGR_4_TOOL_TIP,
  SGR_5_TOOL_TIP,
  SGR_6_TOOL_TIP,
  SGR_9_TOOL_TIP,
} from 'constants/index';
import PointsTitle from './PointsTitle';
import EarnAmount from './EarnAmount';
interface IDappTableProps {
  dataSource: IRankingData[];
  loading: boolean;
  totalCount: number;
  pagination: {
    current: number;
    pageSize: number;
  };
  onClickRow?: (IRankingData) => void;
  onChange?: ({ field, order }: { field?: string; order?: string }) => void;
  onPaginationChange?: ({ page, pageSize }: { page?: number; pageSize?: number }) => void;
}
export function RankingTable({
  dataSource,
  loading,
  totalCount,
  onChange,
  onClickRow,
  pagination,
  onPaginationChange,
}: IDappTableProps) {
  const columns: TableColumnsType<any> = [
    {
      title: 'Ranking',
      dataIndex: 'rank',
      key: 'rank',
      fixed: 'left',
    },
    {
      title: 'Customised Link',
      dataIndex: 'domain',
      key: 'domain',
      render: (text: string) => {
        return text.length > 25 ? (
          <Tooltip title={text}>
            <div className="font-medium flex items-center text-base text-brandDefault text-ellipsis">
              <a
                target="_black"
                href={`https://${text}`}
                className="text-brandDefault"
                onClick={(e) => e.stopPropagation()}>
                <span>{text.slice(0, 25)}...</span>{' '}
              </a>
              <QuestionIconComp className="w-4 h-4 md:w-0 md:h-0 ml-1 cursor-pointer" width={16} height={16} />
            </div>
          </Tooltip>
        ) : (
          <div className="font-medium text-base text-brandDefault text-ellipsis">
            <a
              target="_black"
              href={`https://${text}`}
              className="text-brandDefault"
              onClick={(e) => e.stopPropagation()}>
              <span>{text}</span>
            </a>
          </div>
        );
      },
    },
    {
      title: 'Wallet Address for Receiving Points',
      dataIndex: 'address',
      key: 'address',
      render: (address: string) => {
        const fullAddress = addPrefixSuffix(address);
        const omittedAddress = getOmittedStr(fullAddress, OmittedType.ADDRESS);
        return (
          <div className="flex">
            <span className=" text-neutralPrimary text-base font-medium">{omittedAddress}</span>
            <CommonCopy type="black" toCopy={fullAddress}></CommonCopy>
          </div>
        );
      },
    },
    {
      title: <PointsTitle tip={SGR_11_TOOL_TIP} title="XPSGR-11" />,
      dataIndex: 'elevenSymbolAmount',
      key: 'elevenSymbolAmount',
      sorter: true,
      sortDirections: ['descend', 'ascend', 'descend'],
      defaultSortOrder: 'descend',
      render: (amount) => <EarnAmount amount={amount} />,
    },
    {
      title: <PointsTitle tip={SGR_10_TOOL_TIP} title="XPSGR-10" />,
      dataIndex: 'tenSymbolAmount',
      key: 'tenSymbolAmount',
      sorter: true,
      sortDirections: ['descend', 'ascend', 'descend'],
      render: (amount) => <EarnAmount amount={amount} />,
    },
    {
      title: <PointsTitle tip={SGR_9_TOOL_TIP} title="XPSGR-9" />,
      dataIndex: 'nineSymbolAmount',
      key: 'nineSymbolAmount',
      sorter: true,
      sortDirections: ['descend', 'ascend', 'descend'],
      render: (amount) => <EarnAmount amount={amount} />,
    },
    {
      title: <PointsTitle tip={SGR_6_TOOL_TIP} title="XPSGR-6" />,
      dataIndex: 'sixSymbolAmount',
      key: 'sixSymbolAmount',
      sorter: true,
      sortDirections: ['descend', 'ascend', 'descend'],
      render: (amount) => <EarnAmount amount={amount} />,
    },
    {
      title: <PointsTitle tip={SGR_5_TOOL_TIP} title="XPSGR-5" />,
      dataIndex: 'fiveSymbolAmount',
      key: 'fiveSymbolAmount',
      sorter: true,
      sortDirections: ['descend', 'ascend', 'descend'],
      render: (amount) => <EarnAmount amount={amount} />,
    },
    {
      title: <PointsTitle tip={SGR_4_TOOL_TIP} title="XPSGR-4" />,
      dataIndex: 'fourSymbolAmount',
      key: 'fourSymbolAmount',
      sorter: true,
      sortDirections: ['descend', 'ascend', 'descend'],
      render: (amount) => <EarnAmount amount={amount} />,
    },
    {
      title: <PointsTitle tip={SGR_3_TOOL_TIP} title="XPSGR-3" />,
      dataIndex: 'thirdSymbolAmount',
      key: 'thirdSymbolAmount',
      sorter: true,
      sortDirections: ['descend', 'ascend', 'descend'],
      render: (amount) => <EarnAmount amount={amount} />,
    },
    {
      title: <PointsTitle tip={SGR_2_TOOL_TIP} title="XPSGR-2" />,
      dataIndex: 'secondSymbolAmount',
      key: 'secondSymbolAmount',
      sorter: true,
      sortDirections: ['descend', 'ascend', 'descend'],
      width: 180,
      render: (_, item) => {
        return <EarnAmountCount {...item} amount={item.secondSymbolAmount} className="text-base" />;
      },
    },
    {
      title: <PointsTitle tip={SGR_1_TOOL_TIP} title="XPSGR-1" />,
      dataIndex: 'firstSymbolAmount',
      key: 'firstSymbolAmount',
      sorter: true,
      sortDirections: ['descend', 'ascend', 'descend'],
      render: (amount) => <EarnAmount amount={amount} />,
    },
  ];

  return (
    <div className="mt-6">
      <ConfigProvider
        renderEmpty={() => (
          <p className=" font-medium text-base text-neutralSecondary py-10 md:py-40"> No search results</p>
        )}>
        <Table
          rowKey="domain"
          dataSource={dataSource}
          columns={columns}
          loading={loading}
          locale={{
            emptyText: 'No results found',
          }}
          onRow={(record) => {
            return {
              onClick: () => {
                onClickRow(record);
              },
            };
          }}
          onChange={(_a, _b, sorter) => {
            onChange({
              field: (sorter as SorterResult<any>).field as string,
              order: (sorter as SorterResult<any>).order as string,
            });
          }}
          scroll={{
            x: 'max-content',
          }}></Table>
      </ConfigProvider>
      <div className="py-[22px]">
        <Pagination
          hideOnSinglePage={true}
          {...pagination}
          showSizeChanger
          total={totalCount}
          pageChange={(page) => onPaginationChange({ page })}
          pageSizeChange={(page, pageSize) => onPaginationChange({ page, pageSize })}
        />
      </div>
    </div>
  );
}
