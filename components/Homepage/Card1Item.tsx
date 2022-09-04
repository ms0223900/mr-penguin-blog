/* eslint-disable @next/next/no-img-element */
import { Box, Paper } from '@mui/material';
import { SinglePost } from 'common-types';
import TagItemV2 from 'components/Common/TagItemV2';
import TagListV2 from 'components/Common/TagListV2';
import Link from 'next/link';
import React, { memo } from 'react';
import { STATIC_ROUTES } from 'router';
import styles from './card-1-item.module.scss';

export type Card1ItemProps = SinglePost;

const Card1Item = ({
  id,
  title,
  subTitle,
  thumbnail,
  tagList,
}: Card1ItemProps) => {
  return (
    <Link href={STATIC_ROUTES.getPostWithId(id)}>
      <a className={styles['card-1-item']}>
        <Paper>
          {thumbnail && (
            <div className="img--wrapper">
              <img
                loading="lazy"
                src={thumbnail.src}
                alt={thumbnail.name || 'thumbnail'}
              />
            </div>
          )}
          <Box className={styles['content--wrapper']}>
            <Box className={styles['title--wrapper']}>
              <h3>{title}</h3>
              <h4>{subTitle}</h4>
            </Box>
            <Box className={styles['tag-list--root']}>
              {tagList && tagList.length > 0 && (
                <TagListV2 tagListData={tagList} />
              )}
            </Box>
          </Box>
        </Paper>
      </a>
    </Link>
  );
};

export default memo(Card1Item);
