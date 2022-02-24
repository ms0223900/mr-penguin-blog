import { SinglePost } from 'common-types';
import SortingHelpers from 'lib/handlers/SortingHelpers';
import mandora from './posts/mandora';
import nuxt3Pinia from './posts/nuxt3-pinia';
import taichungLatternFes from './posts/taichung-lattern-fes';

const posts: SinglePost[] = [mandora, taichungLatternFes, nuxt3Pinia].sort(
  (p, n) => SortingHelpers.sortByDateFn()(p.createdAt, n.createdAt)
);

export default posts;
