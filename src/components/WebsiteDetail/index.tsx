import { ReactNode, useMemo } from 'react';
import CommonCopy from 'components/CommonCopy';
import { OmittedType, addPrefixSuffix, getOmittedStr } from 'utils/addressFormatting';
import { useResponsive } from 'ahooks';
import TextTruncation from 'components/TextTruncation';
import clsx from 'clsx';
import SkeletonImage from 'components/SkeletonImage';
import { useSelector } from 'redux/store';
import { getConfig } from 'redux/reducer/info';

export interface IWebsiteDetailProps {
  data: {
    img: string | ReactNode;
    name: string;
    domainDesc: string;
    websiteUrl: string;
    addressInfo?: {
      prefixText: string;
      address: string;
    };
    richText: string;
  };
}

export default function WebsiteDetail({ data }: IWebsiteDetailProps) {
  const responsive = useResponsive();
  const config = useSelector(getConfig);

  const fullAddress = useMemo(() => {
    if (!data.addressInfo) return;
    const address = data.addressInfo.address;
    return addPrefixSuffix(address, config.curChain);
  }, [config.curChain, data.addressInfo]);

  return (
    <section className="rounded-xl p-[16px] md:p-[40px] bg-[var(--neutral-hover-bg)]">
      <section className="flex items-center">
        {typeof data.img === 'string' ? (
          <SkeletonImage img={data.img} className={clsx('w-[74px] h-[74px] rounded-sm')} />
        ) : (
          data.img
        )}
        <span className="ml-[16px] text-[16px] md:text-[24px] leading-[24px] md:leading-[32px] font-semibold flex-1 truncate text-[var(--neutral-title)]">
          {data.name}
        </span>
      </section>
      <section className="flex flex-col gap-[8px] mt-[8px] md:mt-[16px] text-[var(--neutral-title)] md:text-[18px] text-[14px] leading-[22px] md:leading-[26px] font-medium">
        <div className="flex items-center">
          {responsive.md && <span className="mr-[16px]">{data.domainDesc}</span>}
          {data.websiteUrl ? (
            <CommonCopy type="blue" toCopy={data.websiteUrl} className="text-[var(--brand-default)]">
              <span
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(`https://${data.websiteUrl}`, '_blank');
                }}>
                {data.websiteUrl}
              </span>
            </CommonCopy>
          ) : null}
        </div>
        {data?.addressInfo && (
          <div className="flex items-center">
            {responsive.md && <span className="mr-[16px]">{data.addressInfo.prefixText}</span>}
            <CommonCopy type="blue" toCopy={fullAddress} className="text-[var(--brand-default)]">
              {getOmittedStr(fullAddress, OmittedType.ADDRESS)}
            </CommonCopy>
          </div>
        )}
      </section>
      <section className="mt-[8px] md:mt-[16px]">
        <TextTruncation text={data.richText ? decodeURIComponent(data.richText) : data.richText} row={3} />
      </section>
    </section>
  );
}
