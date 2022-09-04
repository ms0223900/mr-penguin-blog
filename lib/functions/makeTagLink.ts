import { getSearchByValParams } from 'lib/custom-hooks/useSearchByVal';

const makeTagLink = (tagName: string) =>
  getSearchByValParams(decodeURI(`@${tagName}`));

export default makeTagLink;
