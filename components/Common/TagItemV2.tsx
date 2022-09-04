import { Box } from '@mui/material';
import makeTagLink from 'lib/functions/makeTagLink';
import Link from 'next/link';
import React, { memo } from 'react';
import styles from './tag-item-v2.module.scss';

export interface TagItemV2Props {
  tagName: string;
}

const TagItemV2 = ({ tagName }: TagItemV2Props) => {
  const link = makeTagLink(tagName);

  return (
    <Link href={link}>
      <a className={styles['tag-item-v2']}>{tagName}</a>
    </Link>
  );
};

export default memo(TagItemV2);
