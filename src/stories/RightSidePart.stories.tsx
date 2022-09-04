import { ArticleOutlined } from '@mui/icons-material';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import TitleWrapper from 'components/RightSidePart/TitleWithIconWrapper';
import PostWithIdxItem, {
  PostWithIdxItemProps,
} from 'components/RightSidePart/PostWithIdxItem';
import PostWithIdxList from 'components/RightSidePart/PostWithIdxList';
import 'styles/globals.scss';
import MakeDataListHelpers from 'lib/functions/MakeDataListHelpers';

export default {
  title: 'RightSidePart/TitleWrapper',
  component: TitleWrapper,
} as ComponentMeta<any>;

const TitleWrapperTemp: ComponentStory<typeof TitleWrapper> = (args) => (
  <TitleWrapper {...args} />
);

export const titleWrapper = TitleWrapperTemp.bind({});
titleWrapper.args = {
  title: 'Penguin Loves Boooooks',
  iconEl: <ArticleOutlined />,
};

const makePostWithIdxItemProps = (
  idx = 0,
  options?: Partial<PostWithIdxItemProps>
) => ({
  idx,
  postId: 'abc',
  title: '【讀書心得】閒人出租(1)',
  ...options,
});

const PostWithIdxItemTemp: ComponentStory<typeof PostWithIdxItem> = (args) => (
  <PostWithIdxItem {...args} />
);

export const postWithIdxItem = PostWithIdxItemTemp.bind({});
postWithIdxItem.args = {
  idx: 1,
  postId: 'abc',
  title: '【讀書心得】閒人出租(1)',
};

const PostWithIdxListTemp: ComponentStory<typeof PostWithIdxList> = (args) => (
  <PostWithIdxList {...args} />
);

export const postWithIdxList = PostWithIdxListTemp.bind({});
postWithIdxList.args = {
  postWithIdxListData: MakeDataListHelpers.makeArrData(
    (i) =>
      makePostWithIdxItemProps(i + 1, {
        postId: 'abc' + i,
        title:
          i % 2 === 0
            ? '【讀書心得】閒人出租(1)'
            : '【讀書心得】閒人出租(1) 不同的生存之道，誰說無用就是廢物?',
      }),
    5
  ),
};
