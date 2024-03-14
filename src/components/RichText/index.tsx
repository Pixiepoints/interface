import richText from 'utils/richText';

export default ({ text, className }: { text: string; className?: string }) => {
  const richHTML = richText(text);
  return <div className={className} dangerouslySetInnerHTML={{ __html: richHTML }}></div>;
};
