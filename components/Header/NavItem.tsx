import { Box, Icon, List, ListItem, Menu, Typography } from '@mui/material';
import { SingleNav } from 'common-types';
import Link from 'next/link';
import React, { memo } from 'react';
import styles from './nav-item.module.scss';

export type NavItemProps = SingleNav;

const NavItem = ({ title, link, icon: SvgIcon, subNavList }: NavItemProps) => {
  const content = (
    <>
      {SvgIcon &&
        SvgIcon({
          fontSize: 'small',
        })}
      <Typography>{title}</Typography>
      {subNavList.length > 0 && (
        <List className={styles['sub-nav-list--wrapper']}>
          {subNavList.map((sub) => (
            <NavItem key={sub.link} {...sub} />
          ))}
        </List>
      )}
    </>
  );
  if (link) {
    return (
      <li className={styles['nav-item']}>
        <Link href={link}>
          <a>{content}</a>
        </Link>
      </li>
    );
  }
  return <li className={styles['nav-item']}>{content}</li>;
};

export default memo(NavItem);
