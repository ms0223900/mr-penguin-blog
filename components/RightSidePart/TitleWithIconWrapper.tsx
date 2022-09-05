import { Box } from '@mui/material';
import React, { memo } from 'react';
import styles from './title-wrapper.module.scss';

export interface TitleWithIconWrapperProps {
  title: string;
  iconEl?: JSX.Element;
  children?: JSX.Element | JSX.Element[];
}

const TitleWithIconWrapper = ({
  title,
  iconEl,
  children,
}: TitleWithIconWrapperProps) => {
  return (
    <Box paddingBottom={10}>
      <Box className={styles['title-wrapper']}>
        {iconEl && <div className={styles['icon--wrapper']}>{iconEl}</div>}
        <h2>{title}</h2>
      </Box>
      {children}
    </Box>
  );
};

export default memo(TitleWithIconWrapper);
