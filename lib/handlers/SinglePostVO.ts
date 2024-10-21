import { SinglePost } from "common-types";

export class SinglePostVO {
    private _post: SinglePost;

    constructor(param: SinglePost) {
        this._post = param
    }

    get value(): SinglePost {
        return this._post;
    }

    static makePost(param: {
        thumbnailUrl: string;
        subTitle: string;
        id: string;
        title: string
    } & Partial<SinglePost>): SinglePostVO {
        return new SinglePostVO({
            ...param,
            thumbnail: {
                src: param.thumbnailUrl,
            },
            uid: "",
            description: "",
            content: "",
            tagList: [],
            createdAt: "",
            relatedArticleList: [],
        });
    }
}
