import { ArticleOutlined } from '@mui/icons-material';
import { SinglePost } from 'common-types';
import convertToPostWithIdxItemProps from 'components/RightSidePart/functions/convertToPostWithIdxItemProps';
import MakeDataListHelpers from 'lib/functions/MakeDataListHelpers';
import {
  POST_SLICE_AMOUNT_LIST_DATA,
  SEE_MORE_LINK_LIST_DATA,
  TAG_NAME_LIST_DATA,
  TITLE_LIST_DATA,
} from '../configs';
import { HomepageProps } from '../Homepage';

const checkPostShouldPutInByTagList = (post: SinglePost, tagList: string[]) => {
  const postTagList = post.tagList;

  for (let i = 0; i < postTagList.length; i++) {
    const postTag = postTagList[i];
    if (tagList.includes(postTag)) return true;
  }

  return false;
};

const groupPostsByTag = (
  posts: SinglePost[]
): { tag: string; posts: SinglePost[] }[] => {
  const postsByTagMap: Record<SinglePost['tagList'][0], SinglePost[]> = {};

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const { tagList } = post;

    tagList.forEach((tag) => {
      if (!postsByTagMap[tag]) postsByTagMap[tag] = [];

      postsByTagMap[tag].push(post);
    });
  }

  const res = [];
  const tags = Object.keys(postsByTagMap);
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    res[i] = {
      tag,
      posts: postsByTagMap[tag] || [],
    };
  }

  return res;
};

const convertToHomepageProps = (
  postListData: SinglePost[],
  selectedPostListData: SinglePost[]
): HomepageProps => {
  const res: HomepageProps = {
    postCardListWithTitleData: MakeDataListHelpers.makeArrData(
      (i) => ({
        title: TITLE_LIST_DATA[i],
        postListData: postListData
          .filter((p) =>
            checkPostShouldPutInByTagList(p, TAG_NAME_LIST_DATA[i])
          )
          .slice(0, POST_SLICE_AMOUNT_LIST_DATA[i]),
        seeMoreLink: SEE_MORE_LINK_LIST_DATA[i],
      }),
      3
    ),
    selectedPostListDataWithTitle: {
      title: '精選文章',
      iconEl: <ArticleOutlined />,
      postWithIdxListData: selectedPostListData.map(
        convertToPostWithIdxItemProps
      ),
    },
    groupPostListData: groupPostsByTag(postListData).map((posts) => ({
      tagTitle: posts.tag,
      postList: posts.posts,
    })), // TODO
  };

  return res;
};

export default convertToHomepageProps;
