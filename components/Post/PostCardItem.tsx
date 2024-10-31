import { Box, Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Link from 'next/link';
import { SinglePostFromPostList } from 'pages/api/posts';
import React, { memo } from 'react';
import { STATIC_ROUTES } from 'router';

const useStyles = makeStyles<Theme, PostCardItemProps>(
    (theme) => {
        // console.log(theme);
        return {
            root: {
                width: '100%',
                // color: theme.palette.primary.main,
                borderRadius: '0.5rem',
                overflow: 'hidden',
                height: '100%',
                marginBottom: '80px',
                paddingBottom: '80px',
                minHeight: theme.spacing(30),
                '&:hover': {
                    boxShadow: theme.shadows[3],
                },
            },
            card: {
                position: 'relative',
                display: 'block',
                height: '100%',
                // backgroundImage: (props) => {
                //   const bgImg = props.thumbnail
                //     ? `url('${props.thumbnail.src}')`
                //     : undefined;
                //   console.log(bgImg);
                //   return bgImg;
                // },
                backgroundSize: 'cover',
                backgroundPosition: 'top center',
                cursor: 'pointer',
            },
            titleDescpWrapper: {
                position: 'absolute',
                bottom: -80,
                width: '100%',
                padding: theme.spacing(1),
                // paddingBottom: theme.spacing(5),
                background: `linear-gradient(180deg, #ffffff 0%, #ffffff 60%, #ffffff10 100%)`,
                '& h3': {
                    ...theme.typography.h5,
                    fontWeight: 'bolder',
                    // fontSize: theme.typography.h5.fontSize,
                },
            },
        };
    },
    {
        name: 'MuiCustomStyle', // SSR 一定要加上name
    }
);

export type PostCardItemProps = SinglePostFromPostList & {
    style?: React.CSSProperties;
};

const PostCardItem = (props: PostCardItemProps) => {
    const { id, title, subTitle, thumbnail, style } = props;
    const classes = useStyles(props);
    return (
        <div className={classes.root} style={style}>
            {/*// TODO, refactor*/}
            <Link href={id.includes(STATIC_ROUTES.sideProjects) ? id : STATIC_ROUTES.getPostWithId(id)}>
                <Box
                    component={'a'}
                    className={classes.card}
                    style={{
                        backgroundImage: props.thumbnail
                            ? `url('${props.thumbnail.src}')`
                            : undefined,
                    }}
                >
                    <Box className={classes.titleDescpWrapper}>
                        <Typography component={'h3'}>{title}</Typography>
                        <Typography component={'h4'}>{subTitle}</Typography>
                    </Box>
                </Box>
            </Link>
        </div>
    );
};

export default memo(PostCardItem);
