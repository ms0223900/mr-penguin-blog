import { ArrowRightOutlined, ChevronRightRounded } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import Link from 'next/link';
import React, { memo } from 'react';
import styles from './title-wrapper.module.scss';

export interface TitleWrapperProps {
  title: string;
  seeMoreLink: string;
  children: JSX.Element | JSX.Element[];
}

const TitleWrapper = ({ title, seeMoreLink, children }: TitleWrapperProps) => {
  return (
    <Box className={styles['title--wrapper']}>
      <Box className={styles.title}>
        <Typography fontWeight={'bold'}>{title}</Typography>
        <Button>
          <Link href={seeMoreLink}>
            <a className={styles['see-more-link']}>
              <span>{'see more'}</span>
              <ChevronRightRounded />
            </a>
          </Link>
        </Button>
      </Box>
      <div>{children}</div>
    </Box>
  );
};

export default memo(TitleWrapper);
