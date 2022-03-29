import React, { memo, useEffect, useRef } from 'react';
import { Container, Divider, Theme, Typography } from '@mui/material';
import { PrismAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  darcula,
  vscDarkPlus,
} from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import { SinglePost } from 'common-types';
import replaceMarkdownHighlightContent from 'lib/functions/replaceMarkdownHighlightContent';
import MarkdownContentHandlers from 'lib/handlers/MarkdownContentHandlers';
import Head from 'next/head';
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

const PostContent = ({
  title,
  subTitle,
  description,
  content,
  thumbnail,
}: PostContentProps) => {
  const markdownWrapperRef = useRef<HTMLDivElement>(null);
  const classes = useStyles();
  // test
  useEffect(() => {
    if (markdownWrapperRef.current) {
      // console.log(markdownWrapperRef.current);
      const el = markdownWrapperRef.current;
      const heading1 = el.getElementsByTagName('h1');
      const heading2 = el.getElementsByTagName('h2');
      const heading3 = el.getElementsByTagName('h3');
      const headings = [...heading1, ...heading2, ...heading3];

      headings.forEach((el) => {
        el.setAttribute('id', el.innerText);
        const link = document.createElement('a');
        link.innerHTML = `#`;
        link.href = `#${el.innerText}`;
        el.prepend(link);
      });
    }
  }, []);
  return (
    <Container className={classes.root}>
      <Head>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={thumbnail?.src} />
      </Head>
      <Box className={classes.titleWrapper}>
        <Typography className={classes.postTitle} component={'h1'}>
          {title}
        </Typography>
        <Typography className={classes.postSubtitle} component={'h2'}>
          {subTitle}
        </Typography>
      </Box>
      <Divider />
      <div ref={markdownWrapperRef}>
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm, remarkHeadingId]}
          className={styles['markdown-content']}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              if (!inline && match) {
                return (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    wrapLines={true}
                    wrapLongLines={true}
                    {...props}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                );
              }
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {replaceMarkdownHighlightContent(content)}
        </ReactMarkdown>
      </div>
    </Container>
  );
};

export default memo(PostContent);
