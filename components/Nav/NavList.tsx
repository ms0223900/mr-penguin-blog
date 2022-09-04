import { Box } from '@mui/material';
import React, { memo } from 'react';
import { NAV_LIST_DATA } from './config';
import NavItem from './NavItem';
import styles from './nav-list.module.scss';

const NavList = () => {
  return (
    <Box className={styles['nav-list']}>
      <ul>
        {NAV_LIST_DATA.map((n) => (
          <NavItem key={n.link} {...n} />
        ))}
      </ul>
    </Box>
  );
};

export default memo(NavList);
