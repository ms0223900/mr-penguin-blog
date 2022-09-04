import { Box } from '@mui/material';
import { SinglePost } from 'common-types';
import React, { memo } from 'react';
import Card1Item from './Card1Item';
import styles from './card-1-list.module.scss';

export interface Card1ListProps {
  postListData: SinglePost[];
}

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
