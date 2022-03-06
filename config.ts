export const API =
  // process.env.NODE_ENV === 'development'
  //   ? 'http://localhost:3000'
  //   : 'https://mr-penguin-blog.vercel.app';

  process.env.NODE_ENV === 'development'
    ? 'http://localhost:1337'
    : 'https://peaceful-hollows-08572.herokuapp.com';

export const WEB_TITLE = 'PenguinCho';
