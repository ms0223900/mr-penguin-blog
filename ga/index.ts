import sendGaEvent from './sendEvent';

const GA_EVENTS = {
  post: {
    browse: (postId: string) =>
      sendGaEvent({
        action: 'browse',
        category: 'post',
        value: postId,
      }),
  },
};

export default GA_EVENTS;
