import { Box, Container } from '@mui/material';
import React, { memo } from 'react';
import navListData from 'static/nav-header.static';
import NavItem from './NavItem';
import styles from './nav-header.module.scss';
import Link from 'next/link';
import { WEB_TITLE } from 'config';

const NavHeader = () => {
  return (
    <Box className={styles.root} component={'nav'} paddingX={1}>
      <Container className={styles['nav-header']}>
        <Link href={'/'}>
          <a className={styles.logo}>
            {WEB_TITLE}
            <span>{"Penguin's Dialy Life"}</span>
          </a>
        </Link>
        <ul className={styles['nav-list--wrapper']}>
          {navListData.map((n, i) => (
            <NavItem key={(n.link || '') + i} {...n} />
          ))}
        </ul>
      </Container>
    </Box>
  );
};

export default memo(NavHeader);
