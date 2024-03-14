import { useCopyToClipboard } from 'react-use';
import React from 'react';
import { CopyIconBlue, CopyIconBlack } from 'assets/images/icons/index';
import { message } from 'antd';
import clsx from 'clsx';
export default function CommonCopy({
  toCopy,
  children,
  className,
  type = 'blue',
}: {
  toCopy: string;
  children?: React.ReactNode;
  className?: string;
  type?: 'blue' | 'black';
}) {
  const [, setCopied] = useCopyToClipboard();
  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        setCopied(toCopy);
        message.success('Copied');
      }}
      className={clsx('flex items-center cursor-pointer', className)}>
      {children}
      <span className="ml-2">{type === 'blue' ? <CopyIconBlue /> : <CopyIconBlack />}</span>
    </span>
  );
}
