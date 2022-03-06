import { SinglePost } from 'common-types';

const replaceMarkdownHighlightContent = (content: SinglePost['content']) => {
  if (!content) return '';

  const matched = content.matchAll(/\s?==.+==\s?/g);
  if (!matched) return content;

  const matchedArr = [...matched];
  let res = content;
  matchedArr.forEach((matched) => {
    const matchedStr = matched[0];
    const markedStr = matchedStr
      .replace(/\s+==/g, '<mark>')
      .replace(/==\s+/g, '</mark>');
    res = res.replace(matchedStr, markedStr);
  });

  return res;
};

export default replaceMarkdownHighlightContent;
