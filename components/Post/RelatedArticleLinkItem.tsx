import { NorthEastOutlined } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { SinglePost } from 'common-types';
import Link from 'next/link';
import React, { memo } from 'react';
import { STATIC_ROUTES } from 'router';
import styles from './related-article-link-item.module.scss';

export type RelatedArticleLinkItemProps = Pick<
  SinglePost,
  'id' | 'title' | 'subTitle'
>;

const RelatedArticleLinkItem = (props: RelatedArticleLinkItemProps) => {
  return (
    <Link href={STATIC_ROUTES.getPostWithId(props.id)}>
      <a className={styles['related-article-link-item']}>
        <Box className={styles['title--wrapper']}>
          <Typography fontSize={'20px'}>{props.title}</Typography>
          <Box className={styles['icon--wrapper']}>
            <NorthEastOutlined />
          </Box>
        </Box>
        <Box className={styles['subtitle--wrapper']}>
          <span>{props.subTitle}</span>
        </Box>
      </a>
    </Link>
  );
};

export default memo(RelatedArticleLinkItem);
