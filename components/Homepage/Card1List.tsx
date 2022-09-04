import { Box } from '@mui/material';
import React, { memo } from 'react';
import Card1Item from './Card1Item';
import styles from './card-1-list.module.scss';
import { PostCardListData } from './types';

export type Card1ListProps = PostCardListData;

const Card1List = ({ postListData }: Card1ListProps) => {
  return (
    <Box className={styles['card-1-list']}>
      {postListData.map((p) => (
        <Card1Item key={p.id} {...p} />
      ))}
    </Box>
  );
};

export default memo(Card1List);
