import { Box, Divider, Typography } from '@mui/material';
import { ID } from 'common-types';
import PostLinkWrapper from 'components/Common/PostLinkWrapper';
import Link from 'next/link';
import React, { memo } from 'react';
import styles from './post-with-idx-item.module.scss';

export interface PostWithIdxItemProps {
  postId: ID;
  idx: number;
  title: string;
}

const PostWithIdxItem = ({ postId, idx, title }: PostWithIdxItemProps) => {
  return (
    <PostLinkWrapper postId={postId}>
      <>
        {idx > 1 && <Divider />}
        <Box className={styles['post-with-idx-item']}>
          <Box className={styles.idx}>{idx}</Box>
          <Box className={styles.title}>
            <Typography>{title}</Typography>
          </Box>
        </Box>
      </>
    </PostLinkWrapper>
  );
};

export default memo(PostWithIdxItem);
