import clsx from 'clsx';
import SkeletonImage from 'components/SkeletonImage';
import { StaticImageData } from 'next/image';
import React from 'react';

export interface IDappInfoCard {
  logo?: string | StaticImageData;
  name: string;
  className?: string;
  layout?: 'horizontal' | 'vertical';
}

function DappInfoCard(params: IDappInfoCard) {
  const { logo, name, className, layout = 'horizontal' } = params;
  return (
    <div className={clsx('flex items-center', layout === 'vertical' ? 'flex-col' : 'flex-row', className)}>
      {logo ? (
        <SkeletonImage
          img={logo}
          className={clsx(
            'w-[72px] md:w-[84px] h-[72px] md:h-[84px]',
            layout === 'vertical' ? 'mb-[16px]' : 'mr-[16px]',
          )}
        />
      ) : null}
      <span className="text-xl text-neutralPrimary font-semibold">{name}</span>
    </div>
  );
}

export default React.memo(DappInfoCard);
