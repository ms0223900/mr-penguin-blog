import { API_BASE_URL } from "components/ShortenUrl/repo/config";

interface ShortenUrlDto {
    url: string
}

interface Response<T> {
    data: T
}

const SHORTEN_URL_API = API_BASE_URL + "/shorten-url";

interface CreatedShortenUrlDto {
    url: string
    hash: string
}

export const ShortenUrlRepo = {
    getByHash: async (urlHash: string) => {
        return await fetch(SHORTEN_URL_API + "/" + urlHash).then(res => res.json()) as Response<ShortenUrlDto>;
    },
    createShortenUrl: async (urlVal: string) => {
        return await fetch(SHORTEN_URL_API, {
            mode: "cors",
            method: "POST",
            body: JSON.stringify({
                url: urlVal,
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json() as unknown as Response<CreatedShortenUrlDto>).catch(e => e)
    }
};
