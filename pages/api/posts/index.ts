import { NextApiRequest, NextApiResponse } from 'next';
import posts from 'static/posts';
import { PostResponse } from './[post_id]';

export type SinglePostFromPostList = PostResponse;
export type PostListResponse = SinglePostFromPostList[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ data: PostListResponse }>
) {
  const data = posts.map((p) => ({
    ...p,
    // content: '',
  }));
  res.status(200).json({
    data,
  });
}
