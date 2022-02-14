import { NextApiRequest, NextApiResponse } from 'next';
import posts from 'static/mock/posts';

export interface PostResponse {
  id: string;
  title: string;
  description: string;
  content: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ data: PostResponse | null }>
) {
  const { post_id } = req.query;
  const foundPost = posts.find((p) => p.id === post_id);

  if (foundPost) {
    return res.status(200).send({
      data: foundPost,
    });
  }
  return res.status(404).send({
    data: null,
  });
}
