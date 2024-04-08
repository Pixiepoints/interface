import React from 'react';
import { Table, Button } from 'aelf-design';
import { RightOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { useResponsive } from 'hooks/useResponsive';
import Link from 'next/link';

interface IDappTableProps {
  dataSource: IDappListData[];
  loading: boolean;
}
export function DappTable({ dataSource, loading }: IDappTableProps) {
  const { isMD } = useResponsive();
  const columns: TableColumnsType<any> = [
    {
      title: 'dApp',
      dataIndex: 'dappName',
      key: 'dappName',
      width: 540,
      render: (text: string, item) => {
        return (
          <div className="flex items-center gap-x-4">
            {!item.icon ? null : (
              <img className="w-8 h-8 md:w-16 md:h-16 rounded-md" width={64} height={64} alt="logo" src={item.icon} />
            )}
            <span className=" text-sm font-medium md:text-base text-neutralTitle">{text}</span>
          </div>
        );
      },
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 540,
      responsive: ['md'],
      render: (text: string) => {
        return <span className=" font-medium text-base text-neutralTitle">{text}</span>;
      },
    },
    {
      title: 'Interaction',
      dataIndex: 'Action',
      key: 'Action',
      render: (_, item) => {
        return (
          <div className="flex items-center gap-x-4 md:gap-x-12">
            <Link href={`/apply/${encodeURI(item.dappName)}`}>
              <Button
                type="primary"
                disabled={!item.supportsApply}
                className=" w-[112px] md-[123px]"
                size={isMD ? 'small' : 'medium'}>
                {item.supportsApply ? 'Apply' : 'Coming Soon'}
              </Button>
            </Link>
            <Button
              type="link"
              className="!px-0"
              size={isMD ? 'small' : 'medium'}
              onClick={() => {
                window.open(item.link, '_blank');
              }}>
              <span className="text-brandDefault hover:text-brandHover">{isMD ? 'dApp' : 'Go to dApp'}</span>
              <RightOutlined className="w-4 h-4 text-brandDefault ml-1 md:ml-4" width={20} height={20} />
            </Button>
          </div>
        );
      },
    },
  ];

  return <Table dataSource={dataSource} columns={columns} loading={loading} rowKey="dappName"></Table>;
}
