import clsx from 'clsx';
import React from 'react';

interface IProps {
  title?: string;
  className?: string;
}

function Title({ title, className }: IProps) {
  return (
    <div className={clsx('flex flex-col md:flex-row items-start md:items-center', className)}>
      <span className="text-4xl text-neutralTitle font-semibold">{title}</span>
      <div className="bg-brandBg h-[32px] flex justify-center items-center px-[12px] text-xs font-medium text-brandDefault rounded-sm mt-[16px] md:ml-[24px] md:mt-0">
        Earn Points
      </div>
    </div>
  );
}

export default React.memo(Title);
