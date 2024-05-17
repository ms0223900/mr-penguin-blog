import { ID } from 'common-types';

export const STATIC_ROUTES = {
    getPostWithId: (id: ID) => `/posts/${id}`,
    posts: `/posts`,
    sideProjects: '/side-projects',
    getTagSearchWithTagName: (tagName: string) => `/tag/${tagName}`,
};
