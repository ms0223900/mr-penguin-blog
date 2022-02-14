import { SingleNav } from 'common-types';

const navListData: SingleNav[] = [
  {
    title: 'FrontEnd',
    link: '/posts',
    subNavList: [
      {
        title: 'FrontEnd',
        link: '/posts',
        subNavList: [],
      },
      {
        title: 'FrontEnd',
        link: '/posts',
        subNavList: [],
      },
    ],
  },
  {
    title: 'Books',
    subNavList: [],
  },
];

export default navListData;
