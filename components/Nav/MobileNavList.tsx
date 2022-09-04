import { Box, Drawer } from '@mui/material';
import { Callback } from 'common-types';
import React, { memo } from 'react';
import { NAV_LIST_DATA } from './config';
import NavItem from './NavItem';
import styles from './mobile-nav-list.module.scss';

export interface MobileNavListProps {
  isOpened: boolean;
  onCloseDrawer: Callback;
}

const MobileNavList = ({ isOpened, onCloseDrawer }: MobileNavListProps) => {
  return (
    <Drawer
      className={styles['mobile-nav-list']}
      anchor="left"
      open={isOpened}
      onClose={onCloseDrawer}
    >
      <Box padding={1}>{'Logo and others :)'}</Box>
      <ul>
        {NAV_LIST_DATA.map((n) => (
          <NavItem key={n.link} {...n} />
        ))}
      </ul>
      <Box>About me and others</Box>
    </Drawer>
  );
};

export default memo(MobileNavList);
