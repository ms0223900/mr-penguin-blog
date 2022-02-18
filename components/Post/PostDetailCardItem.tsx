import { Box, Paper, Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { SinglePost } from 'common-types';
import TagLinkItem from 'components/Common/TagLinkItem';
import MarkdownContentHandlers from 'lib/handlers/MarkdownContentHandlers';
import Link from 'next/link';
import React, { memo, useMemo } from 'react';
import { STATIC_ROUTES } from 'router';
import PostContent from './PostContent';

export type PostDetailCardItem = SinglePost;

const useStyles = makeStyles<Theme>(
  (theme) => ({
    root: {
      position: 'relative',
      paddingBottom: theme.spacing(3),
      cursor: 'pointer',
    },
    card: {
      position: 'relative',
      padding: theme.spacing(1),
      maxHeight: `${500}px`,
      borderRadius: theme.spacing(2),
      overflow: 'hidden',

      '&:hover': {
        boxShadow: theme.shadows[5],
      },
      '&::before': {
        zIndex: 0,
        display: 'block',
        content: '""',
        position: 'absolute',
        left: 0,
        bottom: '0px',
        width: '100%',
        height: `${30}%`,
        background: `linear-gradient(0deg, #ffffff 0%, #ffffff 60%, #ffffff10 100%)`,
        filter: `blur(10px)`,
        // backgroundColor: '#000',
      },
    },
    postInfo: {
      position: 'absolute',
      top: theme.spacing(2),
      right: theme.spacing(2),
      [theme.breakpoints.down('md')]: {
        display: 'none',
      },
    },
    titleDescpWrapper: {
      '& h3': {
        ...theme.typography.h5,
        fontWeight: 'bolder',
        // fontSize: theme.typography.h5.fontSize,
      },
    },
    seeMore: {
      position: 'absolute',
      bottom: theme.spacing(1),
      zIndex: 1,
      paddingLeft: theme.spacing(4),
      textDecoration: 'underline',
      color: theme.palette.primary.main,
    },
  }),
  {
    name: 'PostDetailCardItem',
  }
);

const PostDetailCardItem = (props: PostDetailCardItem) => {
  const { id, title, subTitle, content, tagList, createdAt } = props;
  const classes = useStyles();
  const summary = useMemo(
    () => MarkdownContentHandlers.getSummaryContent(content),
    [content]
  );

  return (
    <Box className={classes.root}>
      <Link href={STATIC_ROUTES.getPostWithId(id)}>
        <a>
          <Paper className={classes.card}>
            <Box className={classes.postInfo}>
              <Typography>{createdAt}</Typography>
              {tagList.map((t) => (
                <TagLinkItem key={t} tagName={t} />
              ))}
            </Box>
            <Box className={classes.titleDescpWrapper}>
              <PostContent {...props} content={summary} />
            </Box>
            <Typography className={classes.seeMore}>{'查看更多'}</Typography>
          </Paper>
        </a>
      </Link>
    </Box>
  );
};

export default memo(PostDetailCardItem);
