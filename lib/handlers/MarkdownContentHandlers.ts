const MarkdownContentHandlers = {
  getSummaryContent: (content: string, maxContentStrLine = 10) => {
    const devided = content.split(/\n/g);
    // console.log(devided);
    const summaryContentList = devided.slice(0, maxContentStrLine);
    const res = summaryContentList.join('\n');
    return res;
  },

  getHeadingTxtWithIdList: (content: string) => {
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
