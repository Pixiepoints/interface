import React, { useMemo } from 'react';
import { Table, Tooltip, Pagination } from 'aelf-design';
import { ConfigProvider } from 'antd';
import { ReactComponent as QuestionIconComp } from 'assets/images/icons/questionCircleOutlined.svg';
import { EarnAmountCount } from './EarnAmountDynamic';
import CommonCopy from 'components/CommonCopy';
import { ColumnsType, SorterResult, SortOrder } from 'antd/es/table/interface';
import { OmittedType, addPrefixSuffix, getOmittedStr } from 'utils/addressFormatting';
import PointsTitle from './PointsTitle';
import EarnAmount from './EarnAmount';
import styles from './style.module.css';
interface IDappTableProps {
  dataSource: IRankingData[];
  loading: boolean;
  totalCount: number;
  pagination: {
    current: number;
    pageSize: number;
  };
  pointsColumn: Array<any>;
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
  pointsColumn,
  onPaginationChange,
}: IDappTableProps) {
  const columns: ColumnsType<IDappListData> = useMemo(() => {
    return [
      {
        title: 'Ranking',
        dataIndex: 'rank',
        key: 'rank',
        fixed: 'left',
      } as any,
      {
        title: 'Customised Link',
        dataIndex: 'domain',
        key: 'domain',
        fixed: 'left',
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
        fixed: 'left',
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
    ].concat(
      pointsColumn?.map((item) => {
        return {
          title: <PointsTitle tip={item?.tipText} title={item?.title} />,
          dataIndex: item?.dataIndex,
          key: item?.dataIndex,
          sorter: true,
          width: item?.supportsSelfIncrease ? 180 : undefined,
          sortDirections: ['descend', 'ascend', 'descend'] as SortOrder[],
          defaultSortOrder: (item?.defaultSortOrder || undefined) as SortOrder,
          render: (amount, data) => {
            return item?.supportsSelfIncrease ? (
              <EarnAmountCount {...data} amount={amount} className="text-base" />
            ) : (
              <EarnAmount amount={amount} />
            );
          },
        } as any;
      }) || [],
    );
  }, [pointsColumn]);

  return (
    <div className="mt-6">
      <ConfigProvider
        renderEmpty={() => (
          <p className=" font-medium text-base text-neutralSecondary py-10 md:py-40"> No search results</p>
        )}>
        <Table
          className={styles.rankingTable}
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
