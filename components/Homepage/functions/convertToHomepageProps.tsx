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
  };

  return res;
};

export default convertToHomepageProps;
