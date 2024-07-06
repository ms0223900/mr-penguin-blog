"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";

const API_BASE_URL = "https://ancient-chamber-92530-10811f1cc15e.herokuapp.com/api";

interface ShortenUrlDto {
    url: string
}

interface Response<T> {
    data: T
}

const ShortenUrlRepo = {
    getByHash: async (urlHash: string) => {
        return await fetch(API_BASE_URL + "/shorten-url/" + urlHash).then(res => res.json()) as Response<ShortenUrlDto>;
    }
};

function useRedirectToUrl() {
    const router = useRouter();
    const urlHash = router.query.hash as string;

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<any>();

    useEffect(() => {
        if (!urlHash) return
        if (loading) return

        (async () => {
                try {
                    setLoading(true)
                    const shortenUrlDto = await ShortenUrlRepo.getByHash(urlHash);
                    const url = shortenUrlDto.data.url;
                    if (!url) return

                    window.location.href = url
                } catch (e: unknown) {
                    setErr(e as any)
                } finally {
                    setLoading(false)
                }
            }
        )()
    }, [urlHash])
    return { loading, err, urlHash };
}

const ShortenUrl: React.FC = (props) => {
    const { loading, err, urlHash } = useRedirectToUrl();

    return (
        <div
            className={urlHash ? "fixed z-[100000] top-0 left-0 z-10 w-full h-full bg-white" : "min-h-[80vh]"}>
            {loading && (
                <div className={"w-full h-full flex items-center justify-center"}>
                    <h2>Redirecting...</h2>
                </div>
            )}
            {err && (
                <p>{err?.message}</p>
            )}
            <div className={"text-center"}>
                <h1>Shorten Url :)</h1>
                <hr />
                <div className={"flex flex-col gap-2 justify-center p-4 px-8"}>
                    <input
                        className={"p-2 rounded-md"}
                        placeholder={"Enter url for shorten :)"} />
                    <button className={"p-1 py-2 rounded-md bg-blue-600 text-white font-bold min-w-[200px]"}>
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShortenUrl;
