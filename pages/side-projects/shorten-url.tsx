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
const ShortenUrl: React.FC = (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<any>();
    const urlHash = router.query.hash as string;

    useEffect(() => {
        if (!urlHash) return

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

        //
    }, [urlHash])
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
            </div>
        </div>
    );
};

export default ShortenUrl;
