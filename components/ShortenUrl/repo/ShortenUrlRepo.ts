import { API_BASE_URL } from "components/ShortenUrl/repo/config";

interface ShortenUrlDto {
    url: string
}

interface Response<T> {
    data: T
}

export const ShortenUrlRepo = {
    getByHash: async (urlHash: string) => {
        return await fetch(API_BASE_URL + "/shorten-url/" + urlHash).then(res => res.json()) as Response<ShortenUrlDto>;
    }
};
