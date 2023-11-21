import { ChevronRightOutlined } from '@mui/icons-material';
import { SinglePost } from 'common-types';
import Link from 'next/link';
import React, { memo } from 'react';

export interface GroupPostsItemProps {
  postList: SinglePost[];
  tagTitle: string;
}

const GroupPostsItem: React.FC<GroupPostsItemProps> = ({
  tagTitle,
  postList,
}) => {
  return (
    <div>
      <h4
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <ChevronRightOutlined />
        {tagTitle}
      </h4>
      <ul>
        {postList.map((post) => (
          <Link key={post.id} href={`/posts/${post.id}`}>
            <a>
              <li>
                <p>{post.title}</p>
                <span>{post.createdAt}</span>
              </li>
            </a>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default memo(GroupPostsItem);
