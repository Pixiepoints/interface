import { Col, Row } from 'antd';
import { ColumnsType } from 'antd/es/table';
import CommonCopy from 'components/CommonCopy';
import SkeletonImage from 'components/SkeletonImage';
import { IEarnToken } from 'types/earnToke';
import { OpenLink } from 'assets/images/icons/index';
import { EarnAmountCount } from 'pageComponents/ranking/comps/EarnAmountDynamic';
import { RoleTypeName } from 'types/role';
import {
  SGR_10_TOOL_TIP,
  SGR_11_TOOL_TIP,
  SGR_12_TOOL_TIP,
  SGR_1_TOOL_TIP,
  SGR_2_TOOL_TIP,
  SGR_3_TOOL_TIP,
  SGR_4_TOOL_TIP,
  SGR_5_TOOL_TIP,
  SGR_6_TOOL_TIP,
  SGR_7_TOOL_TIP,
  SGR_8_TOOL_TIP,
  SGR_9_TOOL_TIP,
} from 'constants/index';
import PointsTitle from 'pageComponents/ranking/comps/PointsTitle';
import EarnAmount from 'pageComponents/ranking/comps/EarnAmount';

export const columns: (params?: { showShareModal?: (data: IEarnToken) => void }) => ColumnsType<IEarnToken> = ({
  showShareModal,
}) => {
  return [
    {
      title: 'dApp',
      width: 200,
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
    // {
    //   title: 'Wallet Address for Receiving Points',
    //   width: 320,
    //   key: 'address',
    //   dataIndex: 'address',
    //   render: (address: string) => (
    //     <CommonCopy type="black" toCopy={addPrefixSuffix(address)}>
    //       <span className=" text-neutralPrimar text-base font-medium">
    //         {getOmittedStr(addPrefixSuffix(address), OmittedType.ADDRESS)}
    //       </span>
    //     </CommonCopy>
    //   ),
    // },
    {
      title: <PointsTitle title="XPSGR-12" tip={SGR_12_TOOL_TIP} />,
      dataIndex: 'twelveSymbolAmount',
      key: 'twelveSymbolAmount',
      sorter: true,
      sortDirections: ['descend', 'ascend', 'descend'],
      defaultSortOrder: 'descend',
      render: (amount) => <EarnAmount amount={amount} />,
    },
    {
      title: <PointsTitle title="XPSGR-11" tip={SGR_11_TOOL_TIP} />,
      dataIndex: 'elevenSymbolAmount',
      key: 'elevenSymbolAmount',
      sorter: true,
      sortDirections: ['descend', 'ascend', 'descend'],
      render: (amount) => <EarnAmount amount={amount} />,
    },
    {
      title: <PointsTitle title="XPSGR-10" tip={SGR_10_TOOL_TIP} />,
      dataIndex: 'tenSymbolAmount',
      key: 'tenSymbolAmount',
      sorter: true,
      sortDirections: ['descend', 'ascend', 'descend'],
      render: (amount) => <EarnAmount amount={amount} />,
    },
    {
      title: <PointsTitle title="XPSGR-9" tip={SGR_9_TOOL_TIP} />,
      dataIndex: 'nineSymbolAmount',
      key: 'nineSymbolAmount',
      sorter: true,
      sortDirections: ['descend', 'ascend', 'descend'],
      render: (amount) => <EarnAmount amount={amount} />,
    },
    {
      title: <PointsTitle title="XPSGR-8" tip={SGR_8_TOOL_TIP} />,
      dataIndex: 'eightSymbolAmount',
      key: 'eightSymbolAmount',
      sorter: true,
      sortDirections: ['descend', 'ascend', 'descend'],
      render: (amount) => <EarnAmount amount={amount} />,
    },
    {
      title: <PointsTitle title="XPSGR-7" tip={SGR_7_TOOL_TIP} />,
      dataIndex: 'sevenSymbolAmount',
      key: 'sevenSymbolAmount',
      sorter: true,
      sortDirections: ['descend', 'ascend', 'descend'],
      render: (amount) => <EarnAmount amount={amount} />,
    },
    {
      title: <PointsTitle title="XPSGR-6" tip={SGR_6_TOOL_TIP} />,
      dataIndex: 'sixSymbolAmount',
      key: 'sixSymbolAmount',
      sorter: true,
      sortDirections: ['descend', 'ascend', 'descend'],
      render: (amount) => <EarnAmount amount={amount} />,
    },
    {
      title: <PointsTitle title="XPSGR-5" tip={SGR_5_TOOL_TIP} />,
      dataIndex: 'fiveSymbolAmount',
      key: 'fiveSymbolAmount',
      sorter: true,
      sortDirections: ['descend', 'ascend', 'descend'],
      render: (amount) => <EarnAmount amount={amount} />,
    },
    {
      title: <PointsTitle title="XPSGR-4" tip={SGR_4_TOOL_TIP} />,
      dataIndex: 'fourSymbolAmount',
      key: 'fourSymbolAmount',
      sorter: true,
      sortDirections: ['descend', 'ascend', 'descend'],
      render: (amount) => <EarnAmount amount={amount} />,
    },
    {
      title: <PointsTitle title="XPSGR-3" tip={SGR_3_TOOL_TIP} />,
      dataIndex: 'thirdSymbolAmount',
      key: 'thirdSymbolAmount',
      sorter: true,
      sortDirections: ['descend', 'ascend', 'descend'],
      render: (amount) => <EarnAmount amount={amount} />,
    },
    {
      title: <PointsTitle title="XPSGR-2" tip={SGR_2_TOOL_TIP} />,
      dataIndex: 'secondSymbolAmount',
      key: 'secondSymbolAmount',
      width: 180,
      sorter: true,
      sortDirections: ['descend', 'ascend', 'descend'],
      render: (secondSymbolAmount, item) => (
        <EarnAmountCount {...item} amount={secondSymbolAmount} className="text-base" />
      ),
    },
    {
      title: <PointsTitle title="XPSGR-1" tip={SGR_1_TOOL_TIP} />,
      dataIndex: 'firstSymbolAmount',
      key: 'firstSymbolAmount',
      sorter: true,
      sortDirections: ['descend', 'ascend', 'descend'],
      render: (amount) => <EarnAmount amount={amount} />,
    },
  ];
};
