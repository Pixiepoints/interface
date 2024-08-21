import { Col, Row } from 'antd';
import { ColumnsType } from 'antd/es/table';
import CommonCopy from 'components/CommonCopy';
import SkeletonImage from 'components/SkeletonImage';
import { IEarnToken } from 'types/earnToke';
import { OpenLink } from 'assets/images/icons/index';
import { RoleTypeName } from 'types/role';
import PointsTitle from 'pageComponents/ranking/comps/PointsTitle';
import { SortOrder } from 'antd/es/table/interface';
import { EarnAmountCount } from 'pageComponents/ranking/comps/EarnAmountDynamic';
import EarnAmount from 'pageComponents/ranking/comps/EarnAmount';

export const columns: (params?: {
  showShareModal?: (data: IEarnToken) => void;
  pointsColumns: Array<any>;
}) => ColumnsType<IEarnToken> = ({ showShareModal, pointsColumns }) => {
  return [
    {
      title: 'dApp',
      width: 220,
      key: 'dappName',
      dataIndex: 'dappName',
      render: (dappName: string, record: IEarnToken) => (
        <Row gutter={[24, 0]} align="middle">
          <Col>
            <SkeletonImage img={record.icon} className="w-[40px] h-[40px]" />
          </Col>
          <Col>
            <span className="text-base text-neutralPrimar font-medium">{dappName}</span>
          </Col>
        </Row>
      ),
    },
    {
      title: 'Customised Link',
      width: 280,
      key: 'domain',
      dataIndex: 'domain',
      render: (domain: string, record: IEarnToken) => (
        <span className="flex items-center" onClick={(e) => e.stopPropagation()}>
          <a target="_black" href={`https://${domain}`} className="ml-2">
            <div className="text-brandDefault text-base font-medium cursor-pointer break-all max-w-[190px] truncate">
              {domain}
            </div>
          </a>
          <CommonCopy toCopy={domain} />
          <div
            className="ml-2"
            onClick={(e) => {
              e.stopPropagation();
              showShareModal && showShareModal(record);
            }}>
            <OpenLink />
          </div>
        </span>
      ),
    },
    {
      title: 'Role',
      width: 150,
      key: 'role',
      dataIndex: 'role',
      render: (role: number) => <span className="text-neutralPrimar text-base font-medium">{RoleTypeName[role]}</span>,
    },
  ].concat(
    pointsColumns?.map((item) => {
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
};
