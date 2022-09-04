import { Box } from '@mui/material';
import React, { memo } from 'react';
import TagItemV2 from './TagItemV2';
import styles from './tag-list-v2.module.scss';

export interface TagListV2Props {
  tagListData: string[];
}

const TagListV2 = ({ tagListData }: TagListV2Props) => {
  return (
    <Box className={styles['tag-list--wrapper']}>
      {tagListData.map((t) => (
        <TagItemV2 key={t} tagName={t} />
      ))}
    </Box>
  );
};

export default memo(TagListV2);
