import { SinglePost } from 'common-types';
import { PostWithIdxItemProps } from '../PostWithIdxItem';

const convertToPostWithIdxItemProps = (
  singlePost: SinglePost,
  idx: number
): PostWithIdxItemProps => ({
  idx: idx + 1,
  postId: singlePost.id,
  ...singlePost,
});

export default convertToPostWithIdxItemProps;
