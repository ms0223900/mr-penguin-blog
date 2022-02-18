import { SinglePost } from 'common-types';
import { NextApiRequest, NextApiResponse } from 'next';
import posts from 'static/posts';

export type PostListResponse = SinglePost[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ data: PostListResponse }>
) {
  const tagName = req.query.tagName as string;
  const data = posts.filter((p) => {
    p.tagList.includes(tagName);
  });
  res.status(200).json({
    data,
  });
}
