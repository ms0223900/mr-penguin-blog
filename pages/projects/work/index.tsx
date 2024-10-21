import { GetStaticProps } from 'next';
import PostList, { PostListViewProps } from '@/components/Post/PostList';
import queryProjectTagArticles from '@/gql/queryProjectTagArticles';
import QueriedArticleHandlers from '@/lib/handlers/QueriedArticleHandlers';
import ProjectTabs from '@/components/Projects/ProjectTabs';

const WorkProjectList = ({ postListData }: PostListViewProps) => {
    return (
        <div>
            <div className={"flex flex-col items-center gap-2 p-4"}>
                <ProjectTabs />
                <h1>Work Projects</h1>
                <hr />
            </div>
            <PostList postListData={postListData} />
        </div>
    )
}

export const getStaticProps: GetStaticProps<PostListViewProps> = async () => {
    try {
        const queried = await queryProjectTagArticles();

        const postListData = QueriedArticleHandlers.handleQueriedArticleList(
            queried.data.articles
        );

        return {
            props: {
                postListData: [
                    ...postListData,
                ],
            },
        };
    } catch (error) {
        return {
            props: {
                postListData: [],
            },
        };
    }
};

export default WorkProjectList;