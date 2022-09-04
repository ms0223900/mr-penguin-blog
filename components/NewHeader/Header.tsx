import { MenuOutlined, SearchRounded } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import MobileNavList from 'components/Nav/MobileNavList';
import NavList from 'components/Nav/NavList';
import useToggle from 'lib/custom-hooks/useToggle';
import Link from 'next/link';
import React, { memo } from 'react';
import styles from './header.module.scss';

const Header = () => {
  const { toggle, handleToggle, handleClose } = useToggle();

  return (
    <nav className={styles.header}>
      <div className={styles['main--wrapper']}>
        <Box display={'flex'} alignItems={'center'}>
          <Button className={styles['menu-btn']} onClick={handleToggle}>
            <MenuOutlined />
          </Button>
          <div>Logo</div>
        </Box>
        <div className={styles.center}>
          <NavList />
          <Link href={'/about-me'}>
            <a>
              <div>{'關於企鵝<(")'}</div>
            </a>
          </Link>
        </div>
        <Button>
          <SearchRounded color={'primary'} />
        </Button>
      </div>
      <div className={styles['mobile--wrapper']}>
        <MobileNavList isOpened={toggle} onCloseDrawer={handleClose} />
      </div>
    </nav>
  );
};

export default memo(Header);
