/* eslint-disable @typescript-eslint/no-empty-interface */
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import React, { memo } from 'react';
import styles from './about-me.module.scss';

export interface AboutMeProps {}

const ABOUT_ME = {
  name: {
    zh: '企鵝72',
    en: 'Penguin Cho',
  },
  content: `一隻愛學習與分享的企鵝。

喜歡以深入淺出的方式分享所學：
1. 每一本有趣的好書、
2. 網頁前端的程式教學
3. 任何加快工作效率的方法

也深度品味日常生活，
佐以畫筆和相機，描繪出生活的輪廓。

每天都會更新文章，
希望可以帶給你一點知識的啟發。`,
};

const AboutMe = ({}: AboutMeProps) => {
  return (
    <Box className={styles['about-me']}>
      <Box display={'flex'} alignItems={'center'}>
        <Box className={styles['profile-img--wrapper']}>
          <Image
            src={'/assets/for-components/blog-profile.jpg'}
            alt={'profile-img'}
            layout={'fill'}
          />
        </Box>
        <Box className={styles['name--wrapper']}>
          <Typography className={styles['name-zh']}>
            {ABOUT_ME.name.zh}
          </Typography>
          <span className={styles['name-en']}>{`(${ABOUT_ME.name.en})`}</span>
        </Box>
      </Box>
      <Typography
        className={styles.content}
        whiteSpace={'pre-wrap'}
        variant={'body1'}
      >
        {ABOUT_ME.content}
      </Typography>
    </Box>
  );
};

export default memo(AboutMe);
