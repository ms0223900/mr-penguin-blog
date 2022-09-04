import { Box } from '@mui/material';
import Link from 'next/link';
import React, { memo } from 'react';
import { NavItemProps } from './types';
import styles from './nav-item.module.scss';
// import { ReactComponent as IconMenuIcon } from './IconMenuBook.svg';
import IconExpandMore from './IconExpandMore.svg';
// console.log(IconMenuIcon);

const NavItem = ({ icon: IconComp, title, link }: NavItemProps) => {
  return (
    <li>
      <Link href={link}>
        <a className={styles['nav-item']}>
          <Box display={'flex'} alignItems={'center'}>
            <div
              style={{
                width: 24,
              }}
              className={'img--wrapper'}
            >
              {IconComp}
            </div>
            <p>{title}</p>
          </Box>
          <Box
            style={{
              width: 24,
            }}
            className={'img--wrapper'}
            marginLeft={0.5}
          >
            <IconExpandMore stroke={2} />
          </Box>
        </a>
      </Link>
    </li>
  );
};

export default memo(NavItem);
