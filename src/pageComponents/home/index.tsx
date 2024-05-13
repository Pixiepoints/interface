import { Input } from 'aelf-design';
import { DappTable } from './comps/DappTable';
import { useHomeLogicService } from './hooks/useHomeLogicService';
import { ReactComponent as SearchIcon } from 'assets/images/icon-search.svg';

export default function HomePage() {
  const { dAppList, loading, onSearch } = useHomeLogicService();
  return (
    <div className="flex flex-col max-w-[1360px] mx-auto px-4">
      <span>test lint</span>
      <div className="py-8 my-6 md:py-[60px] md:mt-12 md:mb-20">
        <h1 className="text-center font-semibold text-neutralTitle text-6xl mb-12">
          {'Become dApp Advocate and Earn Points'}
        </h1>
        <div className="max-w-[668px] mx-auto">
          <Input
            className="!h-16 "
            placeholder="Search dApps"
            prefix={<SearchIcon className="w-[18px] h-[18px]" />}
            onChange={(e) => {
              onSearch((e?.nativeEvent?.target as HTMLInputElement)?.value || '');
            }}></Input>
        </div>
      </div>
      <DappTable dataSource={dAppList} loading={loading} />
    </div>
  );
}
