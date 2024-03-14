import { useAsync } from 'react-use';
import { useParams, useRouter } from 'next/navigation';
import { IEarnTokenDetailProps, IEarnTokenDetailResults } from 'types/earnToke';
import WebsiteDetail from 'components/WebsiteDetail';
import { useSelector } from 'react-redux';
import { getWalletInfo } from 'redux/reducer/userInfo';
import { TokenEarnList } from 'pageComponents/rankingDetail/comps/EarnList';
import { Breadcrumb } from 'antd';
import { useCheckLoginAndToken } from 'hooks/useWallet';
import request from 'api/axios';
import { useTimeoutFn } from 'react-use';

export default function EarnTokenDetail() {
  const params = useParams() as unknown as {
    dappName: string;
    domain: string;
    role: string;
  };
  const walletInfo = useSelector(getWalletInfo);
  const { isOK } = useCheckLoginAndToken();
  const navigation = useRouter();

  const { value } = useAsync(async () => {
    if (!walletInfo.address) {
      return undefined;
    }
    const response = await request.post<IEarnTokenDetailProps, IEarnTokenDetailResults>('app/points/earned/detail', {
      ...params,
      address: walletInfo.address,
    });
    return response;
  }, [params, walletInfo.address]);

  useTimeoutFn(() => {
    if (!isOK) {
      navigation.push('/');
    }
  }, 3000);

  return (
    <div className="max-w-[1440px] w-[100%] mx-auto pt-[32px] pb-[60px] px-[16px] md:pt-[48px] md:pb-[72px] md:px-[40px] bg-[#FFFFFF]">
      <Breadcrumb
        rootClassName="flex item-center"
        separator=">"
        items={[
          {
            title: <span className=" text-sm text-neutralSecondary">Points Earned</span>,
            href: '/earn-token',
          },
          {
            title: <span className=" text-sm text-neutralPrimary font-medium">Details</span>,
          },
        ]}
      />
      <div className="mt-[24px] md:mt-[40px]">
        <WebsiteDetail
          data={{
            img: value?.icon,
            name: value?.dappName,
            domainDesc: 'Customised Link',
            websiteUrl: value?.domain || '',
            // addressInfo: {
            //   prefixText: 'Wallet Address for Receiving Points',
            //   address: walletInfo.address,
            // },
            richText: value?.describe ? decodeURIComponent(value?.describe) : value?.describe,
          }}
        />
      </div>

      <div className="mt-12 text-neutralTitle text-2xl font-semibold ">Activities and Points Earned</div>
      <TokenEarnList dataSource={value?.pointDetails} />
    </div>
  );
}
