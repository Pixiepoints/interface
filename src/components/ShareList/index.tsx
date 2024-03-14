import React from 'react';
import { ReactComponent as TwitterX } from 'assets/images/icons/twitterX.svg';
import { ReactComponent as Telegram } from 'assets/images/icons/telegram.svg';
import { ReactComponent as Facebook } from 'assets/images/icons/facebook.svg';
import { CopyIcon24, CopyIconBlue } from 'assets/images/icons';

import { useCopyToClipboard } from 'react-use';

import styles from './index.module.css';
import { message } from 'antd';
import clsx from 'clsx';
import useResponsive from 'hooks/useResponsive';

function ShareList({ shareUrl }: { shareUrl?: string }) {
  const href = shareUrl || window.location.href;

  const { isMD } = useResponsive();
  const [, setCopied] = useCopyToClipboard();

  const shareList = [
    {
      icon: <TwitterX className="w-[16px] h-[16px] md:w-[24px] md:h-[24px]" />,
      className: styles['share-list-svg-twitter'],
      text: 'X',
      href: `https://twitter.com/intent/tweet?url=${href}`,
    },
    {
      icon: <Telegram className="w-[16px] h-[16px] md:w-[24px] md:h-[24px]" />,
      className: styles['share-list-svg-telegram'],
      text: 'Telegram',
      href: `https://t.me/share/url?url=${href}`,
    },
    {
      icon: <Facebook className="w-[16px] h-[16px] md:w-[24px] md:h-[24px]" />,
      className: styles['share-list-svg-facebook'],
      text: 'FaceBook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${href}`,
    },
    {
      icon: isMD ? <CopyIconBlue /> : <CopyIcon24 />,
      className: styles['share-list-svg-copy'],
      text: 'Copy',
      handle: () => {
        setCopied(href);
        message.success('Copied');
      },
    },
  ];

  return (
    <div className={clsx(styles['share-list-svg'], isMD && styles['share-list-svg-mobile'])}>
      {shareList.map((item, index) => {
        return (
          <div key={index}>
            <a
              href={item.href}
              className={styles['share-card']}
              target="_blank"
              rel="noopener noreferrer"
              onClick={item?.handle}>
              <div className={clsx(item.className, styles['share-icon'])}>{item.icon}</div>
            </a>
          </div>
        );
      })}
    </div>
  );
}

export default React.memo(ShareList);
