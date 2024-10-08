"use client"

import React, { useEffect, useRef, useState } from 'react';
import { useLoadingAndErr, useRedirectToUrl } from "components/ShortenUrl/hooks/useRedirectToUrl";
import { ShortenUrlRepo } from "components/ShortenUrl/repo/ShortenUrlRepo";
import Head from "next/head";
import { WEB_TITLE } from "config";

function getShortenUrl(hash: string) {
    return `${window.location.origin}/side-projects/shorten-url?hash=${hash}`;
}

const ShortenUrl: React.FC = (props) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const { loading, err, urlHash } = useRedirectToUrl();
    const loadingAndErr = useLoadingAndErr();
    const [urlVal, setUrlVal] = useState("");
    const [createdShortenUrl, setCreatedShortenUrl] = useState("");

    async function handleCreateShortenUrl() {
        if (!urlVal) return
        if (loadingAndErr.loading) return

        try {
            loadingAndErr.setLoading(true)
            const shortenUrlDtoResponse = await ShortenUrlRepo.createShortenUrl(urlVal);
            const shortenUrl = getShortenUrl(shortenUrlDtoResponse.data.hash);
            setCreatedShortenUrl(shortenUrl)

            setUrlVal("")
            handleFocusInput();
        } catch (e) {
            console.log("e: ", e);
            loadingAndErr.setErr(e)
        } finally {
            loadingAndErr.setLoading(false)
        }
    }

    function handleFocusInput() {
        inputRef.current?.focus()
    }

    useEffect(() => {
        handleFocusInput();
    }, [])

    return (
        <div
            className={urlHash ? "fixed z-[100000] top-0 left-0 z-10 w-full h-full bg-white" : "min-h-[80vh]"}>
            {loading && (
                <div className={"w-full h-full flex items-center justify-center"}>
                    <h2>Redirecting...</h2>
                </div>
            )}
            <Head>
                <title>{`縮個短網址吧！ | ${WEB_TITLE}`}</title>
                <meta name="description" content="自製的短網址服務 :) 無廣告、無埋碼" />
            </Head>
            {err && (
                <p>{err?.message}</p>
            )}
            <div className={"text-center"}>
                <h1>Shorten Url :)</h1>
                <hr />
                <div className={"flex flex-col gap-2 justify-center p-4 px-8"}>
                    <input
                        ref={inputRef}
                        className={"p-2 rounded-md"}
                        value={urlVal}
                        onChange={e => setUrlVal(e.target.value)}
                        placeholder={"Enter url for shorten :)"} />
                    <button
                        className={"p-1 py-2 rounded-md bg-blue-600 text-white font-bold min-w-[200px] disabled:bg-gray-400"}
                        disabled={loadingAndErr.loading}
                        onClick={handleCreateShortenUrl}>
                        Create
                    </button>
                    {createdShortenUrl && <div>
                        <h3>Created:</h3>
                        <a className={"underline text-blue-600"} href={createdShortenUrl} target={"_blank"}
                           rel="noreferrer">{createdShortenUrl}</a>
                    </div>}
                </div>
            </div>
        </div>
    );
};

export default ShortenUrl;
