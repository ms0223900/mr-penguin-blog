import { Box } from '@mui/material';
import NavList from 'components/Nav/NavList';
import React, { memo } from 'react';
import styles from './header.module.scss';

const Header = () => {
  return (
    <nav className={styles.header}>
      <div>Logo</div>
      <div>
        <NavList />
        <div>{'關於企鵝<(")'}</div>
      </div>
      <div>{'Search Icon'}</div>
    </nav>
  );
};

export default memo(Header);
