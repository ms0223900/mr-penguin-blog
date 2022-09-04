import { Box } from '@mui/material';
import { SinglePost } from 'common-types';
import TagItemV2 from 'components/Common/TagItemV2';
import TagListV2 from 'components/Common/TagListV2';
import ThumbnailImg from 'components/Common/ThumbnailImg';
import Link from 'next/link';
import React, { memo } from 'react';
import { STATIC_ROUTES } from 'router';
import styles from './card-2-item.module.scss';

export type Card2ItemProps = SinglePost;

const Card2Item = ({
  id,
  title,
  subTitle,
  thumbnail,
  tagList,
}: Card2ItemProps) => {
  return (
    <Link href={STATIC_ROUTES.getPostWithId(id)}>
      <a className={styles['card-2-item']}>
        <div className={styles['thumbnail--root']}>
          {thumbnail && <ThumbnailImg {...thumbnail} />}
        </div>
        <Box className={styles['content--wrapper']}>
          <Box className={styles['title--wrapper']}>
            <h3>{title}</h3>
            <h4>{subTitle}</h4>
          </Box>
          <div className={styles['tag-list--root']}>
            {tagList && tagList.length > 0 && (
              <TagListV2 tagListData={tagList} />
            )}
          </div>
        </Box>
      </a>
    </Link>
  );
};

export default memo(Card2Item);
