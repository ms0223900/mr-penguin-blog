import React, { memo, useEffect, useMemo, useRef } from 'react';
import { Container, Divider, Theme, Typography } from '@mui/material';
import { PrismAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import { SinglePost } from 'common-types';
import replaceMarkdownHighlightContent from 'lib/functions/replaceMarkdownHighlightContent';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkHeadingId from 'remark-heading-id';
import styles from './post-content.module.scss';
import TagLinkItem from 'components/Common/TagLinkItem';
import DateStringifyHandlers from 'lib/handlers/DateStringifyHandlers';
export type PostContentProps = SinglePost;

const useStyles = makeStyles<Theme>(
  (theme) => ({
    root: {
      backgroundColor: theme.palette.common.white,
    },
    titleWrapper: {
      padding: `${theme.spacing(2)} 0`,
      paddingLeft: theme.spacing(1),
      paddingTop: `${5}rem`,
      textAlign: 'center',
    },
    postTitle: {
      ...theme.typography.h4,
      fontWeight: 'bolder',
      color: 'var(--primary-main)',
      lineHeight: 1.6,
    },
    dateTagWrapper: {
      display: 'flex',
      'flex-direction': 'column',
      'align-items': 'center',
      paddingBottom: '1rem',
      '& .post-date': {
        display: 'block',
        opacity: 0.5,
        paddingBottom: '1rem',
      },
    },
    postSubtitle: {
      ...theme.typography.h5,
    },
  }),
  {
    name: 'MuiCustomPostContent',
  }
);

const PostContent = ({
  title,
  subTitle,
  description,
  content,
  tagList,
  thumbnail,
  createdAt,
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

      // const imgList = [...el.getElementsByTagName('img')];
      // for (let i = 0; i < imgList.length; i++) {
      //   const el = imgList[i];
      //   const alt = el.getAttribute('alt');
      //   if (!alt) continue;
      //   if (alt?.toLowerCase() === 'untitled') continue;

      //   const altEl = document.createElement('div');
      //   altEl.classList.add('img-alt');
      //   altEl.innerText = alt;
      //   el.parentElement?.appendChild(altEl);
      // }

      const linkEls = el.getElementsByTagName('a');
      for (let i = 0; i < linkEls.length; i++) {
        const linkEl = linkEls[i];
        linkEl.setAttribute('target', '_blank');
      }
    }
  }, []);
  const postDate = useMemo(
    () => DateStringifyHandlers.stringify(createdAt, 'YYYY/MM/DD'),
    [createdAt]
  );

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
      <Box className={classes.dateTagWrapper}>
        <span className="post-date">{postDate}</span>
        <Box>
          {tagList.map((t) => (
            <TagLinkItem key={t} tagName={t} />
          ))}
        </Box>
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
