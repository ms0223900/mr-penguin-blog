import { GroupOutlined, PersonSearchOutlined } from '@mui/icons-material';
import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import AboutMe from 'components/RightSidePart/AboutMe';
import PostWithIdxList, {
  PostWithIdxListProps,
} from 'components/RightSidePart/PostWithIdxList';
import TitleWithIconWrapper, {
  TitleWithIconWrapperProps,
} from 'components/RightSidePart/TitleWithIconWrapper';
import { memo } from 'react';
import Card1List from './Card1List';
import Card2List from './Card2List';
import TitleWrapper, { TitleWrapperProps } from './TitleWrapper';
import { PostCardListData } from './types';
import styles from './homepage.module.scss';
import GroupPostsItem from './GroupPosts/GroupPostsItem';

export interface HomepageProps {
  postCardListWithTitleData: (Omit<TitleWrapperProps, 'children'> &
    PostCardListData)[];
  selectedPostListDataWithTitle: TitleWithIconWrapperProps &
    PostWithIdxListProps;
}

const Homepage = ({
  postCardListWithTitleData,
  selectedPostListDataWithTitle,
}: HomepageProps) => {
  return (
    <Box
      className={styles.homepage}
      width={'100%'}
      maxWidth={1200}
      margin={'auto'}
    >
      <Grid
        container
        xs={12}
        columnSpacing={{
          xs: 0,
          lg: 8,
        }}
      >
        <Grid item xs={12} lg={8}>
          <Box>
            <TitleWrapper {...postCardListWithTitleData[0]}>
              <Card1List {...postCardListWithTitleData[0]} />
            </TitleWrapper>
            <TitleWrapper {...postCardListWithTitleData[1]}>
              <Card2List {...postCardListWithTitleData[1]} />
            </TitleWrapper>
            <TitleWrapper {...postCardListWithTitleData[2]}>
              <Card1List {...postCardListWithTitleData[2]} />
            </TitleWrapper>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          lg={4}
          order={{
            xs: -1,
            lg: 1,
          }}
          className={'right-part'}
        >
          <TitleWithIconWrapper {...selectedPostListDataWithTitle}>
            <PostWithIdxList {...selectedPostListDataWithTitle} />
          </TitleWithIconWrapper>
          <TitleWithIconWrapper title={'分類文章'} iconEl={<GroupOutlined />}>
            <GroupPostsItem />
          </TitleWithIconWrapper>
          <Box className={styles['about-me']}>
            <TitleWithIconWrapper
              title={'About Me'}
              iconEl={<PersonSearchOutlined />}
            >
              <AboutMe />
            </TitleWithIconWrapper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default memo(Homepage);
