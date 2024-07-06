"use client"

import React from 'react';
import { useRedirectToUrl } from "components/ShortenUrl/hooks/useRedirectToUrl";

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
