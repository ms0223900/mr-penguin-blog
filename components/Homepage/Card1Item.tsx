/* eslint-disable @next/next/no-img-element */
import { Box, Paper } from '@mui/material';
import { SinglePost } from 'common-types';
import TagItemV2 from 'components/Common/TagItemV2';
import TagListV2 from 'components/Common/TagListV2';
import ThumbnailImg from 'components/Common/ThumbnailImg';
import Link from 'next/link';
import React, { memo, useMemo } from 'react';
import { STATIC_ROUTES } from 'router';
import styles from './card-1-item.module.scss';
import checkPostIsNew from './functions/checkPostIsNew';

export type Card1ItemProps = SinglePost;

const Card1Item = ({
  id,
  title,
  subTitle,
  thumbnail,
  tagList,
  createdAt,
}: Card1ItemProps) => {
  const shouldShowNewTag = useMemo(
    () => checkPostIsNew(createdAt),
    [createdAt]
  );

  return (
    <Link href={STATIC_ROUTES.getPostWithId(id)}>
      <a className={styles['card-1-item']}>
        {shouldShowNewTag && (
          <img
            className={styles['new-tag-img']}
            src={'/assets/icons/icon-new-tag.png'}
            alt={'new-tag-icon'}
          />
        )}
        <Paper
          style={{
            overflow: 'hidden',
            height: '100%',
          }}
        >
          {thumbnail && (
            <ThumbnailImg
              {...thumbnail}
              wrapperProps={{
                style: {
                  height: 160,
                },
              }}
            />
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
