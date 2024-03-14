import { Typography } from 'antd';
import styles from './index.module.css';
import RichText from 'components/RichText';
import { useState } from 'react';
import { ReactComponent as DownOutlined } from 'assets/images/icons/down-outlined.svg';

const { Paragraph } = Typography;

export default function TextTruncation({ text, row = 2 }: { text: string; row?: number }) {
  const [expand, setExpand] = useState(false);

  const showSymbol = (type: 'more' | 'less') => {
    return (
      <div
        className={`${type === 'less' && 'ml-[16px]'} inline-flex items-center cursor-pointer`}
        onClick={() => {
          setExpand(!expand);
        }}>
        <span className="text-[14px] leading-[22px] font-medium text-[var(--neutral-primary)] mr-[4px]">
          {type === 'more' ? 'Show more' : 'Show less'}
        </span>
        <DownOutlined style={type === 'less' ? { transform: 'rotate(180deg)' } : undefined} />
      </div>
    );
  };

  return (
    <section className="w-full">
      {expand ? (
        <RichText text={text} className={styles.richText} />
      ) : (
        <Paragraph
          className={styles.paragraph}
          ellipsis={
            !expand
              ? {
                  rows: row,
                  expandable: true,
                  onExpand: () => {
                    setExpand(true);
                  },
                  symbol: showSymbol('more'),
                }
              : false
          }>
          {text}
        </Paragraph>
      )}
      {expand && showSymbol('less')}
    </section>
  );
}
