import { Col, Row } from 'antd';
import { ColumnsType } from 'antd/es/table';
import CommonCopy from 'components/CommonCopy';
import SkeletonImage from 'components/SkeletonImage';
import { IEarnToken } from 'types/earnToke';
import { formatTokenPrice } from 'utils/format';
import { OpenLink } from 'assets/images/icons/index';
import { Tooltip } from 'aelf-design';
import { ReactComponent as QuestionIconComp } from 'assets/images/icons/questionCircleOutlined.svg';
import BigNumber from 'bignumber.js';
import { EarnAmountCount } from 'pageComponents/ranking/comps/EarnAmount';
import { RoleTypeName } from 'types/role';
import { SGR_10_TOOL_TIP, SGR_11_TOOL_TIP, SGR_3_TOOL_TIP, SGR_5_TOOL_TIP, SGR_6_TOOL_TIP } from 'constants/index';

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
      title: (
        <div className="flex items-center">
          <Tooltip title="Points Earned from New User Account Creation">
            <QuestionIconComp className="w-4 h-4 mr-1 cursor-pointer" width={16} height={16} />
          </Tooltip>
          <span>XPSGR-1</span>
        </div>
      ),
      dataIndex: 'firstSymbolAmount',
      key: 'firstSymbolAmount',
      sorter: true,
      sortDirections: ['descend', 'ascend'],
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
          <Tooltip title="Perpetual Points (Auto rewards generated every second)">
            <QuestionIconComp className="w-4 h-4 mr-1 cursor-pointer" width={16} height={16} />
          </Tooltip>
          <span>XPSGR-2</span>
        </div>
      ),
      dataIndex: 'secondSymbolAmount',
      key: 'secondSymbolAmount',
      width: 180,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: (secondSymbolAmount, item) => (
        <EarnAmountCount {...item} amount={secondSymbolAmount} className="text-base" />
      ),
    },
    {
      title: (
        <div className="flex items-center">
          <Tooltip title={SGR_3_TOOL_TIP}>
            <QuestionIconComp className="w-4 h-4 mr-1 cursor-pointer" width={16} height={16} />
          </Tooltip>
          <span>XPSGR-3</span>
        </div>
      ),
      dataIndex: 'thirdSymbolAmount',
      key: 'thirdSymbolAmount',
      sorter: true,
      sortDirections: ['descend', 'ascend'],
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
          <Tooltip title={SGR_5_TOOL_TIP}>
            <QuestionIconComp className="w-4 h-4 mr-1 cursor-pointer" width={16} height={16} />
          </Tooltip>
          <span>XPSGR-5</span>
        </div>
      ),
      dataIndex: 'fiveSymbolAmount',
      key: 'fiveSymbolAmount',
      sorter: true,
      sortDirections: ['descend', 'ascend'],
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
          <Tooltip title={SGR_6_TOOL_TIP}>
            <QuestionIconComp className="w-4 h-4 mr-1 cursor-pointer" width={16} height={16} />
          </Tooltip>
          <span>XPSGR-6</span>
        </div>
      ),
      dataIndex: 'sixSymbolAmount',
      key: 'sixSymbolAmount',
      sorter: true,
      sortDirections: ['descend', 'ascend'],
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
          <Tooltip title={SGR_10_TOOL_TIP}>
            <QuestionIconComp className="w-4 h-4 mr-1 cursor-pointer" width={16} height={16} />
          </Tooltip>
          <span>XPSGR-10</span>
        </div>
      ),
      dataIndex: 'thirdSymbolAmount',
      key: 'thirdSymbolAmount',
      sorter: true,
      sortDirections: ['descend', 'ascend'],
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
          <Tooltip title={SGR_11_TOOL_TIP}>
            <QuestionIconComp className="w-4 h-4 mr-1 cursor-pointer" width={16} height={16} />
          </Tooltip>
          <span>XPSGR-11</span>
        </div>
      ),
      dataIndex: 'thirdSymbolAmount',
      key: 'thirdSymbolAmount',
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: (amount) => {
        const text = BigNumber(amount)
          .dividedBy(10 ** 8)
          .toNumber();
        return <span className=" text-neutralPrimary text-base font-medium">{formatTokenPrice(text)}</span>;
      },
    },
  ];
};
