import { Box, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Link from 'next/link';
import React, { memo } from 'react';
import { STATIC_ROUTES } from 'router';

const defaultColor = '#ddd';

export interface TagLinkItemProps {
  tagName: string;
  color?: string;
}

const useStyles = makeStyles<Theme, TagLinkItemProps>(
  (theme) => ({
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
      borderRadius: `10000px`,
      backgroundColor: (props) => {
        console.log(props);
        return props.color || defaultColor;
      },
      cursor: 'pointer',
      '&:hover': {
        opacity: `0.7`,
      },
    },
  }),
  {
    name: 'MuiTagCustomStyle',
  }
);

const TagLinkItem = (props: TagLinkItemProps) => {
  const { tagName, color } = props;
  const classes = useStyles(props);
  return (
    <Link href={STATIC_ROUTES.getTagSearchWithTagName(tagName)}>
      <a
        className={classes.root}
        style={{
          backgroundColor: props.color || defaultColor,
        }}
      >
        {tagName}
      </a>
    </Link>
  );
};

export default memo(TagLinkItem);
