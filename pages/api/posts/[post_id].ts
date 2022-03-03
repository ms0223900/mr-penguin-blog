import { Image, SinglePost } from 'common-types';
import { NextApiRequest, NextApiResponse } from 'next';
import posts from 'static/posts';

export type PostResponse = SinglePost;

export const getMatchedPost = (postId: string | undefined) =>
  posts.find((p) => p.id === postId);

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ data: PostResponse | null }>
) {
  const { post_id } = req.query;
  const foundPost = getMatchedPost(post_id as string);

  if (foundPost) {
    return res.status(200).send({
      data: foundPost,
    });
  }
  return res.status(404).send({
    data: null,
  });
}
