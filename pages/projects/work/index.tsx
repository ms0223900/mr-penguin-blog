import PostList, { PostListViewProps } from '@/components/Post/PostList';
import ProjectTabs from '@/components/Projects/ProjectTabs';
import { articleQueryService } from '@/repository/article/ArticleQueryService';
import { GetStaticProps } from 'next';

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
        const postListData = articleQueryService.getProjectTagArticleList();

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