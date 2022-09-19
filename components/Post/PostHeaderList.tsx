import { FormatListNumberedOutlined } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import TitleWithIconWrapper from 'components/RightSidePart/TitleWithIconWrapper';
import { SingleHeadingTxt } from 'lib/handlers/MarkdownContentHandlers';
import React, { memo, useMemo } from 'react';
import styles from './post-header-list.module.scss';

export interface PostHeaderListProps {
  headerListData: SingleHeadingTxt[];
}

const PostHeaderList = ({ headerListData }: PostHeaderListProps) => {
  const maxLevel = useMemo(
    () => Math.max(...headerListData.map((h) => h.level)),
    [headerListData]
  );
  return (
    <Box className={styles['post-header-list']}>
      <TitleWithIconWrapper
        title={'目錄'}
        iconEl={<FormatListNumberedOutlined />}
      >
        <Box>
          {headerListData.map((h, i) => (
            <a
              key={i}
              href={`#${h.txt}`}
              className={styles['header-item']}
              style={{
                paddingLeft: (maxLevel - h.level) * 20,
              }}
            >
              <span className={styles['hash-deco']}>{'#'}</span>
              <p>{h.txt}</p>
            </a>
          ))}
        </Box>
      </TitleWithIconWrapper>
    </Box>
  );
};

export default memo(PostHeaderList);
