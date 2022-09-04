import { Box, Typography } from '@mui/material';
import React, { memo } from 'react';
import PostWithIdxItem, { PostWithIdxItemProps } from './PostWithIdxItem';

export interface PostWithIdxListProps {
  postWithIdxListData: PostWithIdxItemProps[];
}

const PostWithIdxList = ({ postWithIdxListData }: PostWithIdxListProps) => {
  return (
    <Box
      maxWidth={400}
      borderRadius={2}
      style={{
        backgroundColor: '#fff',
      }}
    >
      {postWithIdxListData.map((p) => (
        <PostWithIdxItem key={p.postId} {...p} />
      ))}
    </Box>
  );
};

export default memo(PostWithIdxList);
