import { Box } from '@mui/material';
import { SinglePost } from 'common-types';
import React, { memo } from 'react';
import Card2Item from './Card2Item';
import styles from './card-2-list.module.scss';

export interface Card2ListProps {
  postListData: SinglePost[];
}

const Card2List = ({ postListData }: Card2ListProps) => {
  return (
    <Box className={styles['card-2-list']}>
      {postListData.map((p) => (
        <Card2Item key={p.id} {...p} />
      ))}
    </Box>
  );
};

export default memo(Card2List);
