import { ID } from 'common-types';
import Link from 'next/link';
import React, { memo } from 'react';
import { STATIC_ROUTES } from 'router';

export interface PostLinkWrapperProps
  extends React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  postId: ID;
  children?: JSX.Element | JSX.Element[] | null;
}

const PostLinkWrapper = (props: PostLinkWrapperProps) => {
  const { postId, children } = props;
  return (
    <Link href={STATIC_ROUTES.getPostWithId(postId)}>
      <a {...props}>{children}</a>
    </Link>
  );
};

export default memo(PostLinkWrapper);
