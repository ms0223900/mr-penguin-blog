import { SinglePost } from "common-types";

export class SinglePostVO {
    private _post: SinglePost;

    constructor(param: SinglePost) {
        this._post = param
    }

    get value(): SinglePost {
        return this._post;
    }
}
