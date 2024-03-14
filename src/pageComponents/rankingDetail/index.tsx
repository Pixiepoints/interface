import { Breadcrumb } from 'antd';
import { useRankingDetailService } from './hooks/useRankingDetailService';
import { TokenEarnList } from './comps/EarnList';
import WebsiteDetail from 'components/WebsiteDetail';

export default function RankingDetailPage() {
  const { rankingDetail } = useRankingDetailService();
  return (
    <section className="flex flex-col max-w-[1360px] mx-auto px-4 pt-12 py-20">
      <Breadcrumb
        rootClassName="flex item-center mb-8"
        separator=">"
        items={[
          {
            title: <span className=" text-sm text-neutralSecondary">Ranking</span>,
            href: '/ranking',
          },
          {
            title: <span className=" text-sm text-neutralPrimary font-medium">Details</span>,
          },
        ]}></Breadcrumb>
      <WebsiteDetail
        data={{
          img: rankingDetail?.icon,
          name: rankingDetail?.dappName || '',
          domainDesc: 'Customised Link',
          websiteUrl: rankingDetail?.domain || '',
          richText: rankingDetail?.describe || '',
        }}
      />
      <h1 className="py-6 font-semibold text-2xl">{'Activities and Points Earned'}</h1>
      <TokenEarnList dataSource={rankingDetail?.pointDetails} />
    </section>
  );
}
