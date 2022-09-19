import { Box, Typography } from '@mui/material';
import { SinglePost } from 'common-types';
import React, { memo } from 'react';
import RelatedArticleLinkItem, {
  RelatedArticleLinkItemProps,
} from './RelatedArticleLinkItem';

export interface RelatedArticleLinkListProps {
  postListData: RelatedArticleLinkItemProps[];
}

const RelatedArticleLinkList = ({
  postListData,
}: RelatedArticleLinkListProps) => {
  return (
    <Box>
      <Typography
        paddingBottom={4}
        color={'primary'}
        fontSize={24}
        fontWeight={'bolder'}
      >
        {'繼續閱讀 Related posts'}
      </Typography>
      {postListData.map((p) => (
        <Box key={p.id} paddingBottom={2.5}>
          <RelatedArticleLinkItem {...p} />
        </Box>
      ))}
    </Box>
  );
};

export default memo(RelatedArticleLinkList);
