"use client"

import React, { useEffect } from 'react';
import { useRouter } from "next/router";

const ShortenUrl: React.FC = (props) => {
    const router = useRouter();
    console.log("router.query: ", router.query);
    useEffect(() => {

        //
    }, [])
    return (
        <div
            className={router.query.hash ? "fixed z-[100000] top-0 left-0 z-10 w-full h-full bg-white" : "min-h-[80vh]"}>
            <h1>Shorten Url :)</h1>
            <p>
                {`Hash: ${router.query.hash}`}
            </p>
        </div>
    );
};

export default ShortenUrl;
