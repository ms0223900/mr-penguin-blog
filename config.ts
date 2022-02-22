export const API =
  // process.env.
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://mr-penguin-blog.vercel.app';

export const WEB_TITLE = 'PenguinCho';
