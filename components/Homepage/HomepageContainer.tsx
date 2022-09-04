import { SinglePost } from 'common-types';
import React, { memo } from 'react';
import useHomepage from './functions/useHomepage';
import Homepage from './Homepage';

export interface HomepageContainerProps {
  postListData: SinglePost[];
}

const HomepageContainer = ({ postListData }: HomepageContainerProps) => {
  const { homepageProps } = useHomepage({ postListData });

  return <Homepage {...homepageProps} />;
};

export default memo(HomepageContainer);
