const NEW_POST_DAYS_DURATION = 3;

const checkPostIsNew = (publishedDate: string) => {
  const _publishedDate = new Date(publishedDate);
  const today = new Date();

  const timeDiff = _publishedDate.getTime() - today.getTime();

  const daysDuration = Math.abs(timeDiff / (1000 * 60 * 60 * 24));
  if (daysDuration <= NEW_POST_DAYS_DURATION) return true;
  return false;
};

export default checkPostIsNew;
