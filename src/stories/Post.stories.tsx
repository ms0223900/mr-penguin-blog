import { ComponentMeta, ComponentStory } from "@storybook/react";
import RelatedArticleLinkList from "components/Post/RelatedArticleLinkList";
import MakeDataListHelpers from "lib/functions/MakeDataListHelpers";
import { makeMockSinglePost } from "./mock/post.mock";

export default {
  title: 'Post/RelatedArticleLinkList',
  component: RelatedArticleLinkList,
} as ComponentMeta<any>;


const RelatedArticleLinkListTemp: ComponentStory<typeof RelatedArticleLinkList> = (args) => (
  <RelatedArticleLinkList {...args} />
);

export const relatedArticleLinkList = RelatedArticleLinkListTemp.bind({});
relatedArticleLinkList.args = {
  postListData: MakeDataListHelpers.makeArrData(
    (i) =>
    makeMockSinglePost(i + 1, {
        title:
          i % 2 === 0
            ? '【讀書心得】閒人出租(1)'
            : '【讀書心得】閒人出租(1) 不同的生存之道，誰說無用就是廢物?',
      }),
    5
  ),
};