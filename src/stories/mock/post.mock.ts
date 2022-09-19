import { SinglePost } from 'common-types';

export const makeMockSinglePost = (
  idx = 0,
  options?: Partial<SinglePost>
): SinglePost => ({
  id: idx.toString(),
  title: '【讀書心得】閒人出租(1)',
  subTitle: '「人」非得有用才行嗎? 只是當「催化劑」也行',
  description: '',
  content: '',
  thumbnail: {
    src: 'https://imgur.com/QscKLTI.jpg',
  },
  createdAt: '',
  tagList: [],
  relatedArticleList: [],
  ...options,
});
