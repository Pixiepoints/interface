import clsx from 'clsx';
import SkeletonImage from 'components/SkeletonImage';
import TextTruncation from 'components/TextTruncation';
import { StaticImageData } from 'next/image';
import React from 'react';

interface IProps {
  image?: string | StaticImageData;
  name?: string;
  introduction?: string;
  className?: string;
}

function Details({ image, name, introduction, className }: IProps) {
  return (
    <div className={clsx('flex min-h-[72px] md:min-h-[120px] items-start md:items-center', className)}>
      {image ? <SkeletonImage img={image} className="w-[72px] md:w-[120px] h-[72px] md:h-[120px] mr-[16px]" /> : null}
      <div className="flex flex-col flex-1">
        <span className="text-2xl text-neutralTitle font-semibold">{name}</span>
        <TextTruncation
          text={`Anyone can apply to be an advocate for ${name} on aelf and earn points for their contributions.By completing this application form, you will register a customised link (subdomain) for ${name}. You can then share it with others, inviting them to interact with ${name} through your customised link. Their activities within ${name} will earn points, for themselves and you.Besides becoming an advocate and having your own customised link, you also have the option to register links on behalf of others, such as your friends and Key Opinion Leaders (KOLs). This will help them earn points, while you will also earn points as their referrer.`}
        />
      </div>
    </div>
  );
}

export default React.memo(Details);
