import React from 'react';
import { Table, ToolTip, Pagination } from 'aelf-design';
import type { TableColumnsType } from 'antd';
import { ConfigProvider } from 'antd';
import { ReactComponent as QuestionIconComp } from 'assets/images/icons/questionCircleOutlined.svg';

import { EarnAmountCount } from './EarnAmount';
import CommonCopy from 'components/CommonCopy';
import { SorterResult } from 'antd/es/table/interface';
import BigNumber from 'bignumber.js';
import { formatTokenPrice } from 'utils/format';
import { OmittedType, addPrefixSuffix, getOmittedStr } from 'utils/addressFormatting';

interface IDappTableProps {
  dataSource: IRankingData[];
  loading: boolean;
  totalCount: number;
  pagination: {
    current: number;
    pageSize: number;
  };
  onClickRow?: (IRankingData) => void;
  onChange?: ({
    page,
    pageSize,
    field,
    order,
  }: {
    page?: number;
    pageSize?: number;
    field?: string;
    order?: string;
  }) => void;
}
export function RankingTable({ dataSource, loading, totalCount, onChange, onClickRow, pagination }: IDappTableProps) {
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
          <ToolTip title={text}>
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
          </ToolTip>
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
        return (
          <div className="flex">
            <span className=" text-neutralPrimary text-base font-medium">
              {getOmittedStr(addPrefixSuffix(address), OmittedType.ADDRESS)}
            </span>
            <CommonCopy type="black" toCopy={address}></CommonCopy>
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex items-center">
          <ToolTip title="Points Earned from New User Account Creation">
            <QuestionIconComp className="w-4 h-4 mr-1 cursor-pointer" width={16} height={16} />
          </ToolTip>
          <span>XPSGR-1</span>
        </div>
      ),
      dataIndex: 'firstSymbolAmount',
      key: 'firstSymbolAmount',
      sorter: true,
      render: (amount) => {
        const text = BigNumber(amount)
          .dividedBy(10 ** 8)
          .toNumber();
        return <span className=" text-neutralPrimary text-base font-medium">{formatTokenPrice(text)}</span>;
      },
    },
    {
      title: (
        <div className="flex items-center">
          <ToolTip title="Perpetual Points (Auto rewards generated every second)">
            <QuestionIconComp className="w-4 h-4 mr-1 cursor-pointer" width={16} height={16} />
          </ToolTip>
          <span>XPSGR-2</span>
        </div>
      ),
      dataIndex: 'secondSymbolAmount',
      key: 'secondSymbolAmount',
      sorter: true,
      width: 180,
      render: (_, item) => {
        return <EarnAmountCount {...item} amount={item.secondSymbolAmount} />;
      },
    },
    {
      title: (
        <div className="flex items-center">
          <ToolTip title="Points Earned from Customised Link Registration">
            <QuestionIconComp className="w-4 h-4 mr-1 cursor-pointer" width={16} height={16} />
          </ToolTip>
          <span>XPSGR-5</span>
        </div>
      ),
      dataIndex: 'fiveSymbolAmount',
      key: 'fiveSymbolAmount',
      sorter: true,
      render: (amount) => {
        const text = BigNumber(amount)
          .dividedBy(10 ** 8)
          .toNumber();
        return <span className=" text-neutralPrimary text-base font-medium">{formatTokenPrice(text)}</span>;
      },
    },
  ];

  return (
    <div className="mt-6">
      <ConfigProvider
        renderEmpty={() => (
          <p className=" font-medium text-base text-neutralSecondary py-10 md:py-40"> No search results</p>
        )}>
        <Table
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
      {!dataSource?.length || totalCount <= 10 ? null : (
        <div className="py-[22px]">
          <Pagination
            {...pagination}
            showSizeChanger
            total={totalCount}
            pageChange={(page, pageSize) => onChange({ page, pageSize })}
            pageSizeChange={(page, pageSize) => onChange({ page, pageSize })}
          />
        </div>
      )}
    </div>
  );
}
