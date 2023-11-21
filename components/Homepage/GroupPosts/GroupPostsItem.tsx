import { ChevronRightOutlined } from '@mui/icons-material';
import { SinglePost } from 'common-types';
import DateStringifyHandlers from 'lib/handlers/DateStringifyHandlers';
import Link from 'next/link';
import React, { memo } from 'react';
import styles from './group-posts-item.module.scss';

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
      <h4 className={styles.title}>
        <ChevronRightOutlined />
        {tagTitle}
      </h4>
      <ul className={styles['list--wrapper']}>
        {postList.map((post) => (
          <Link key={post.id} href={`/posts/${post.id}`}>
            <a className={styles['list-item']}>
              <li
                style={{
                  paddingBottom: '0.5rem',
                }}
              >
                <p>{post.title}</p>
                <span>
                  {DateStringifyHandlers.stringify(
                    post.createdAt,
                    'YYYY/MM/DD'
                  )}
                </span>
              </li>
            </a>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default memo(GroupPostsItem);
