import { SinglePost } from 'common-types';
import React, { memo } from 'react';
import GroupPostsItem from './GroupPostsItem';
import useToggle from 'lib/custom-hooks/useToggle';

export interface GroupPostsItemContainerProps {
  postList: SinglePost[];
  tagTitle: string;
}

const GroupPostsItemContainer = (props: GroupPostsItemContainerProps) => {
  const { toggle, handleToggle } = useToggle();

  return (
    <div onClick={handleToggle}>
      <GroupPostsItem {...props} isOpen={toggle} />
    </div>
  );
};

export default memo(GroupPostsItemContainer);
