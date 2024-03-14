import { Skeleton } from 'antd';
import clsx from 'clsx';
import React from 'react';
import { useState } from 'react';

interface ISkeletonImage {
  img?: string;
  className?: string;
  imageSizeType?: 'cover' | 'contain';
}

function SkeletonImage(props: ISkeletonImage) {
  const { img, className, imageSizeType = 'cover' } = props;

  const [skeletonActive, setSkeletonActive] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  const imageType = {
    cover: 'object-cover',
    contain: 'object-contain',
  };

  return (
    <div className={clsx('relative rounded-lg overflow-hidden', className)}>
      {(loading || !img) && (
        <Skeleton.Image className="absolute top-0 left-0 !w-full !h-full" active={img ? skeletonActive : false} />
      )}
      {img && (
        <img
          width={120}
          height={120}
          src={img}
          alt="image"
          className={clsx('w-full h-full', imageType[imageSizeType])}
          onLoad={() => {
            setLoading(false);
            setSkeletonActive(false);
          }}
          onError={() => {
            setSkeletonActive(false);
          }}
        />
      )}
    </div>
  );
}

export default React.memo(SkeletonImage);
