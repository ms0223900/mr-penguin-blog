import { Container, Divider, Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import { SinglePost } from 'common-types';
import replaceMarkdownHighlightContent from 'lib/functions/replaceMarkdownHighlightContent';
import React, { memo } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkHeadingId from 'remark-heading-id';
import styles from './post-content.module.scss';

export type PostContentProps = SinglePost;

const useStyles = makeStyles<Theme>(
  (theme) => ({
    root: {
      backgroundColor: theme.palette.common.white,
    },
    titleWrapper: {
      padding: `${theme.spacing(2)} 0`,
      paddingLeft: theme.spacing(1),
    },
    postTitle: {
      ...theme.typography.h4,
      fontWeight: 'bolder',
    },
    postSubtitle: {
      ...theme.typography.h5,
    },
  }),
  {
    name: 'MuiCustom',
  }
);

const PostContent = ({ title, subTitle, content }: PostContentProps) => {
  const classes = useStyles();
  return (
    <Container className={classes.root}>
      <Box className={classes.titleWrapper}>
        <Typography className={classes.postTitle} component={'h1'}>
          {title}
        </Typography>
        <Typography className={classes.postSubtitle} component={'h2'}>
          {subTitle}
        </Typography>
      </Box>
      <Divider />
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm, remarkHeadingId]}
        className={styles['markdown-content']}
      >
        {replaceMarkdownHighlightContent(content)}
      </ReactMarkdown>
    </Container>
  );
};

export default memo(PostContent);
