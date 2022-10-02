import { Box, Typography } from '@mui/material';
import React, { memo } from 'react';
import styles from './footer.module.scss';

interface SingleFooterLink {
  text: string;
  link: string;
}

type OtherLinkTypes = 'gitHub' | 'medium' | 'hackMD' | 'notionNotes';

const FOOTER_STATIC_DATA: {
  email: SingleFooterLink;
  otherLinks: Record<OtherLinkTypes, SingleFooterLink>;
} = {
  email: {
    text: 'ms0223900@hotmail.com.tw',
    link: 'ms0223900@hotmail.com.tw',
  },
  otherLinks: {
    gitHub: {
      text: 'GitHub',
      link: 'https://github.com/ms0223900?tab=repositories',
    },
    medium: {
      text: 'Medium',
      link: 'https://medium.com/@ms0223900',
    },
    hackMD: {
      text: 'Vocus',
      link: 'https://vocus.cc/user/61e3ee8efd8978000169c1c7',
    },
    notionNotes: {
      text: 'Notion Notes',
      link: 'https://penguin-cho.notion.site/4dd8cd7cf3794705961417fdd54a9c38?v=56678adb3afa49b0ad5e2adf5abedfd1',
    },
  },
};

const Footer = () => {
  const otherLinksKeyList = Object.keys(
    FOOTER_STATIC_DATA.otherLinks
  ) as (keyof typeof FOOTER_STATIC_DATA.otherLinks)[];

  return (
    <Box className={styles.footer}>
      <Box className={styles.content}>
        <Box className={styles['self-intro']} display={'flex'}>
          <Box className={styles['self-name']}>
            <h4>{'72企鵝'}</h4>
            <p>{'(Penguin Cho)'}</p>
          </Box>
          <Box className={styles['email--wrapper']}>
            <a type="email" href={`mailto:${FOOTER_STATIC_DATA.email.link}`}>
              {FOOTER_STATIC_DATA.email.text}
            </a>
          </Box>
        </Box>
        <Box className={styles['links--wrapper']} display={'flex'}>
          {otherLinksKeyList.map((key) => (
            <a
              key={key}
              target={'_blank'}
              href={FOOTER_STATIC_DATA.otherLinks[key].link}
              rel="noreferrer"
            >
              {FOOTER_STATIC_DATA.otherLinks[key].text}
            </a>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default memo(Footer);
