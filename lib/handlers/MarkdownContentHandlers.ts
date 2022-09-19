import { SinglePost } from 'common-types';

export interface SingleHeadingTxt {
  level: number;
  txt: string;
  id: string;
}

const MarkdownContentHandlers = {
  getSummaryContent: (
    content: SinglePost['content'],
    maxContentStrLine = 10
  ) => {
    if (!content) return '';

    const devided = content.split(/\n/g);
    // console.log(devided);
    const summaryContentList = devided.slice(0, maxContentStrLine);
    const res = summaryContentList.join('\n');
    return res;
  },

  getHeadingTxtWithIdList: (
    content: SinglePost['content']
  ): {
    level: number;
    txt: string;
    id: string;
  }[] => {
    if (!content) return [];

    const devided = content.split(/\n/g);
    const reg = /\#+\s.+(\s?\{\#.+\})?/g;
    const headingList = devided.filter((d) => !!d.match(reg));

    return headingList.map((h) => {
      const headingTxt = h.replace(/\s?{#(.)+?}/g, '').trim();
      const level = [...headingTxt.matchAll(/#/g)].length;
      const txt = headingTxt.replace(/#+\s/g, '');
      const id = h
        .replace(/\s?#+\s.+{#/g, '')
        .slice(0, -1)
        .trim();
      return {
        level,
        txt,
        id,
      };
    });
  },
};

export default MarkdownContentHandlers;
