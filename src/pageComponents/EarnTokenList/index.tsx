import { Row, Col } from 'antd';
import { useRouter } from 'next/navigation';
import CommonSelect from 'components/CommonSelect';
import { Pagination, Table } from 'aelf-design';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { columns } from './column';
import { RoleResult } from 'types/role';
import { IEarnListParams, IEarnToken } from 'types/earnToke';
import useGetDappList from 'hooks/useGetDappList';
import useGetRoleList from 'hooks/useGetRoleList';
import styles from './index.module.css';
import { useCheckLoginAndToken } from 'hooks/useWallet';
import { useModal } from '@ebay/nice-modal-react';
import ResultModal from 'components/ResultModal';
import { useRequest, useTimeout } from 'ahooks';
import { fetchEarnTokenList } from 'api/rankingApi';
import { useWebLogin } from 'aelf-web-login';
import SkeletonImage from 'components/SkeletonImage';

export default function EarnTokenList() {
  const [dappName, setDappName] = useState<string>('');
  const [role, setRole] = useState<number>();
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const { isOK } = useCheckLoginAndToken();
  const resultModal = useModal(ResultModal);
  const { wallet } = useWebLogin();

  const dappList = useGetDappList({ dappName: '' });
  const roleList: RoleResult = useGetRoleList();

  const [sortField, setSortField] = useState<string>();
  const [fieldOrder, setFieldOrder] = useState<string>();

  const selectValue = useMemo(() => {
    return dappList?.filter((item) => item?.dappId === dappName)?.[0];
  }, [dappList, dappName]);

  const defaultSortField = useMemo(() => {
    return selectValue?.rankingColumns?.find((item) => !!item?.defaultSortOrder)?.sortingKeyWord;
  }, [selectValue?.rankingColumns]);

  const {
    data: tokenList,
    loading,
    run: getEarnTokenList,
  } = useRequest(fetchEarnTokenList, {
    manual: true,
  });

  const router = useRouter();

  const getTokenList = useCallback(() => {
    if (!dappName || typeof role === 'undefined' || !wallet.address || !sortField) {
      return;
    }
    const params: IEarnListParams = {
      dappName,
      role,
      skipCount: (pageNum - 1) * pageSize,
      maxResultCount: pageSize,
      Address: wallet.address,
      sortingKeyWord: sortField || defaultSortField,
      sorting: String(fieldOrder).replace('end', '').toUpperCase(),
    };
    if (!fieldOrder) {
      delete params.sorting;
    }
    getEarnTokenList(params);
  }, [dappName, defaultSortField, fieldOrder, getEarnTokenList, pageNum, pageSize, role, sortField, wallet.address]);

  const handleTableChange = ({ pageSize, page }: any, _, sorter) => {
    console.log('sorter', sorter, pageSize, page);
    pageSize && setPageSize(pageSize);
    page && setPageNum(page);
    const { field, order } = sorter;
    const sortField = selectValue?.rankingColumns?.find((item) => item?.dataIndex === field)?.sortingKeyWord;
    sorter && setSortField(sortField || defaultSortField);
    sorter && setFieldOrder(order);
  };

  const renderDappListOptions = useMemo(() => {
    return dappList?.map((item) => ({
      value: item.dappId,
      label: (
        <Row gutter={[24, 0]} align="middle">
          <Col className="hidden md:block">
            <SkeletonImage img={item.icon} className="w-[40px] h-[40px]" />
          </Col>
          <Col className="text-base text-neutralPrimary font-medium">{item.dappName}</Col>
        </Row>
      ),
    }));
  }, [dappList]);

  const renderRoleOptions = useMemo(() => {
    return roleList?.map((item) => ({
      value: item.key,
      label: <span className="text-base text-neutralPrimary font-medium">{item.role}</span>,
    }));
  }, [roleList]);

  const showShareModal = (data: IEarnToken) => {
    resultModal.show({
      modalTitle: 'Share',
      card: {
        title: data.domain,
        description: data.dappName,
      },
      hideButton: true,
      share: {
        hidden: false,
        url: `https://${data.domain}`,
      },
    });
  };

  const pointsColumns = useMemo(() => {
    return selectValue?.rankingColumns?.map((item) => {
      return {
        dataIndex: item?.dataIndex,
        title: item?.label || '',
        defaultSortOrder: item?.defaultSortOrder || undefined,
        tipText: item?.tipText,
      };
    });
  }, [selectValue?.rankingColumns]);

  useEffect(() => {
    if (!dappList?.length) {
      return;
    }
    setDappName(dappList[0].dappId);
  }, [dappList]);

  useEffect(() => {
    defaultSortField && setSortField(defaultSortField);
  }, [defaultSortField]);

  useEffect(() => {
    if (!roleList?.length) {
      return;
    }
    setRole(roleList[0].key);
  }, [roleList]);

  useEffect(() => {
    getTokenList();
  }, [dappName, getTokenList, role, pageNum, pageSize, fieldOrder, sortField]);

  useTimeout(() => {
    if (!isOK) {
      router.replace('/');
    }
  }, 1000);

  return (
    <div
      className={`max-w-[1440px] w-[100%] mx-auto pt-[32px] pb-[60px] px-[16px] md:pt-[48px] md:px-[40px]  ${styles['earn-token-list']}`}>
      <div className="font-semibold md:text-4xl text-2xl  text-neutralTitle">Points Earned</div>
      <Row
        className="pt-[48px]"
        justify="space-between"
        gutter={[
          16,
          {
            xs: 16,
            sm: 16,
            md: 24,
          },
        ]}>
        <Col span={12}>
          <CommonSelect subfix="dApp" options={renderDappListOptions} onChange={setDappName} value={dappName} />
        </Col>
        <Col span={12}>
          <CommonSelect
            subfix="Role"
            className="justify-end"
            options={renderRoleOptions}
            onChange={setRole}
            value={role}
          />
        </Col>
        <Col span={24}>
          <Table
            columns={columns({ showShareModal, pointsColumns })}
            scroll={{
              x: 'max-content',
            }}
            loading={loading}
            dataSource={tokenList?.items}
            rowKey="domain"
            pagination={null}
            locale={{
              emptyText: 'No points yet',
            }}
            onChange={handleTableChange}
            onRow={(record: IEarnToken) => {
              return {
                onClick: () => {
                  router.push(`/earn-token/detail/${dappName}/${record.domain}/${record.role}`);
                },
              };
            }}
          />
          {!tokenList?.items?.length || tokenList?.totalCount <= 10 ? null : (
            <div className="py-[22px]">
              <Pagination
                hideOnSinglePage
                pageSize={pageSize}
                current={pageNum}
                showSizeChanger
                total={tokenList?.totalCount ?? 0}
                pageChange={(page, pageSize) => handleTableChange({ page, pageSize }, null, null)}
                pageSizeChange={(page, pageSize) => handleTableChange({ page, pageSize }, null, null)}
              />
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}
