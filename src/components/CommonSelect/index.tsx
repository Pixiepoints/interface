import { Select, SelectProps, Flex } from 'antd';
import clsx from 'clsx';
import { useMemo } from 'react';
import { DownOutlined } from 'assets/images/icons/index';

interface CommonSelectProps extends SelectProps {
  subfix?: string | React.ReactNode | null;
  subfixClassName?: string;
  selectClassName?: string;
  className?: string;
}

export default function CommonSelect({
  subfix,
  subfixClassName,
  className,
  selectClassName,
  ...props
}: CommonSelectProps) {
  const renderSubfix = useMemo(() => {
    if (!subfix) {
      return null;
    }

    return (
      <div className={clsx('text-neutralTitle font-semibold text-lg hidden md:block mr-4', subfixClassName)}>
        {subfix}
      </div>
    );
  }, [subfix, subfixClassName]);

  return (
    <Flex align="center" className={clsx(className)}>
      {renderSubfix}
      <Select
        {...props}
        suffixIcon={<DownOutlined />}
        className={clsx(
          'text-lg text-neutralTitle font-semibold rounded-sm border-neutralBorder md:h-[64px] h-[48px] max-w-[360px] w-[100%]',
          selectClassName,
        )}
      />
    </Flex>
  );
}
