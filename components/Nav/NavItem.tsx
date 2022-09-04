import { Box } from '@mui/material';
import Link from 'next/link';
import React, { memo } from 'react';
import { NavItemProps } from './types';
import styles from './nav-item.module.scss';
// import { ReactComponent as IconMenuIcon } from './IconMenuBook.svg';
// console.log(IconMenuIcon);

const NavItem = ({ icon: IconComp, title, link }: NavItemProps) => {
  return (
    <li>
      <Link href={link}>
        <a className={styles['nav-item']}>
          <div
            style={{
              width: 24,
            }}
          >
            {IconComp}
          </div>
          <p>{title}</p>
        </a>
      </Link>
    </li>
  );
};

export default memo(NavItem);
