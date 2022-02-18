const MarkdownContentHandlers = {
  getSummaryContent: (content: string, maxContentStrLine = 10) => {
    const devided = content.split(/\n/g);
    // console.log(devided);
    const summaryContentList = devided.slice(0, maxContentStrLine);
    const res = summaryContentList.join('\n');
    return res;
  },
};

export default MarkdownContentHandlers;
