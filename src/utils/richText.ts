export default (text: string): string => {
  const reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
  const richText = text.replace(reg, "<a target='_blank' href='$1$2'>$1$2</a>").replace(/\n/g, '<br />');
  return richText;
};
