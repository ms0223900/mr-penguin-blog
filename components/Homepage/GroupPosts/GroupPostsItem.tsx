import Link from 'next/link';
import React, { memo } from 'react';

const GroupPostsItem = () => {
  return (
    <div>
      <h4>{' > Title'}</h4>
      <ul>
        <Link href={'/posts/30-days-painting-challenge-review'}>
          <a>
            <li>
              <p>{'Title'}</p>
              <span>{'23/07/02'}</span>
            </li>
          </a>
        </Link>
      </ul>
    </div>
  );
};

export default memo(GroupPostsItem);
