import PostList, { PostListViewProps } from 'components/Post/PostList'; // getServerSideProps,
import queryProjectTagArticles from 'gql/queryProjectTagArticles';
import QueriedArticleHandlers from 'lib/handlers/QueriedArticleHandlers';
import { GetStaticProps } from 'next';
import { STATIC_ROUTES } from "../../router";
import { SinglePostVO } from "lib/handlers/SinglePostVO";
import { useRouter } from 'next/router';

const GENERATE_PASSWORD_POST = SinglePostVO.makePost({
    id: `${STATIC_ROUTES.sideProjects}/generate-password`,
    title: '隨機密碼生成器',
    subTitle: '8 ~ 16 碼',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=70&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
}).value;

const SHORTEN_URL_POST = SinglePostVO.makePost({
    id: `${STATIC_ROUTES.sideProjects}/shorten-url`,
    title: '縮網址服務',
    subTitle: '縮個短網址吧！',
    thumbnailUrl: 'https://images.unsplash.com/photo-1510193806518-f731c70a35bb?q=70&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
}).value;

const ACCOUNTING_APP_POST = SinglePostVO.makePost({
    id: `${STATIC_ROUTES.sideProjects}/accounting-app`,
    title: '記帳吧',
    subTitle: '簡單記帳',
    thumbnailUrl: 'https://images.unsplash.com/photo-1459257831348-f0cdd359235f?q=70&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
}).value;

const ACCOUNTING_APP_POST_2 = SinglePostVO.makePost({
    id: `${STATIC_ROUTES.sideProjects}/accounting-app-2`,
    title: '記帳吧 for demo',
    subTitle: '簡單記帳',
    thumbnailUrl: 'https://images.unsplash.com/photo-1459257831348-f0cdd359235f?q=70&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
}).value;

const CURSOR_DEMO_POST = SinglePostVO.makePost({
    id: `${STATIC_ROUTES.sideProjects}/cursor-demo`,
    title: 'Cursor Demo',
    subTitle: 'Cursor Demo',
    thumbnailUrl: "https://images.unsplash.com/photo-1591439657848-9f4b9ce436b9?q=80&w=3102&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
}).value;

const sideProjectPosts = [
    GENERATE_PASSWORD_POST,
    SHORTEN_URL_POST,
    ACCOUNTING_APP_POST,
    ACCOUNTING_APP_POST_2,
    CURSOR_DEMO_POST,
];

export const getStaticProps: GetStaticProps<PostListViewProps> = async (
    ctx
) => {
    try {
        const queried = await queryProjectTagArticles();

        const postListData = QueriedArticleHandlers.handleQueriedArticleList(
            queried.data.articles
        );

        return {
            props: {
                postListData: [
                    ...postListData,
                    ...sideProjectPosts
                ],
            },
        };
    } catch (error) {
        return {
            props: {
                postListData: sideProjectPosts,
            },
        };
    }
};

const ProjectPage = () => {
    return <></>
}

export default ProjectPage;
