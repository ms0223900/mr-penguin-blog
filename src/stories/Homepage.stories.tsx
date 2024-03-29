import { ComponentMeta, ComponentStory } from '@storybook/react';
import TitleWrapper from 'components/Homepage/TitleWrapper';
import Card1Item from 'components/Homepage/Card1Item';
import Card2Item from 'components/Homepage/Card2Item';
import Card1List from 'components/Homepage/Card1List';
import Card2List from 'components/Homepage/Card2List';
import Homepage from 'components/Homepage/Homepage';
import 'styles/globals.scss';
import { makeMockSinglePost } from './mock/post.mock';
import MakeDataListHelpers from 'lib/functions/MakeDataListHelpers';
import { ArticleOutlined } from '@mui/icons-material';

export default {
  title: 'Homepage/TitleWrapper',
  component: TitleWrapper,
} as ComponentMeta<any>;

const TitleWrapperTemp: ComponentStory<typeof TitleWrapper> = (args) => (
  <TitleWrapper {...args} />
);

export const titleWrapper = TitleWrapperTemp.bind({});
titleWrapper.args = {
  title: 'Penguin Loves Boooooks',
  seeMoreLink: '/abc',
};

const Card1ItemTemp: ComponentStory<typeof Card1Item> = (args) => (
  <Card1Item {...args} />
);

export const card1Item = Card1ItemTemp.bind({});
card1Item.args = {
  ...makeMockSinglePost(0, {
    tagList: ['讀書心得', '生活方式', 'aaaa', 'bbbb', 'cccc'],
  }),
};

export const card1ItemWithNoTags = Card1ItemTemp.bind({});
card1ItemWithNoTags.args = {
  ...makeMockSinglePost(),
};

const Card1ListTemp: ComponentStory<typeof Card1List> = (args) => (
  <Card1List {...args} />
);

export const card1List = Card1ListTemp.bind({});
card1List.args = {
  postListData: MakeDataListHelpers.makeArrData(makeMockSinglePost, 6),
};

const card2ItemTemp: ComponentStory<typeof Card2Item> = (args) => (
  <Card2Item {...args} />
);

export const card2Item = card2ItemTemp.bind({});
card2Item.args = {
  ...makeMockSinglePost(0, {
    tagList: ['讀書心得', '生活方式'],
  }),
};

const card2ListTemp: ComponentStory<typeof Card2List> = (args) => (
  <Card2List {...args} />
);

export const card2List = card2ListTemp.bind({});
card2List.args = {
  postListData: MakeDataListHelpers.makeArrData(
    (idx) =>
      makeMockSinglePost(idx, {
        tagList: ['讀書心得', '生活方式'],
      }),
    4
  ),
};

const HomepageTemp: ComponentStory<typeof Homepage> = (args) => (
  <Homepage {...args} />
);

export const homepage = HomepageTemp.bind({});
homepage.args = {
  postCardListWithTitleData: [
    {
      title: 'Penguin Loves Boooooks',
      seeMoreLink: '/abc',
      postListData: MakeDataListHelpers.makeArrData(
        (idx) =>
          makeMockSinglePost(idx, {
            tagList: ['讀書心得', '生活方式'],
          }),
        6
      ),
    },
    {
      title: 'Learn Codes :)',
      seeMoreLink: '/abc',
      postListData: MakeDataListHelpers.makeArrData(
        (idx) =>
          makeMockSinglePost(idx, {
            tagList: ['Code'],
          }),
        4
      ),
    },
    {
      title: "Penguin's Life <(')",
      seeMoreLink: '/abc',
      postListData: MakeDataListHelpers.makeArrData(
        (idx) =>
          makeMockSinglePost(idx, {
            tagList: ['Life'],
          }),
        6
      ),
    },
  ],
  selectedPostListDataWithTitle: {
    title: '精選文章',
    iconEl: <ArticleOutlined />,
    postWithIdxListData: MakeDataListHelpers.makeArrData(
      makeMockSinglePost,
      5
    ).map((p, i) => ({
      ...p,
      postId: p.id,
      idx: i + 1,
    })),
  },
};
