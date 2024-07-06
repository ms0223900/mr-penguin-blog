"use client"

import React from 'react';
import { useRouter } from "next/router";

const ShortenUrl: React.FC = (props) => {
    const router = useRouter();
    console.log("router.query: ", router.query);
    return (
        <div>
            <h1>Shorten Url :)</h1>
            <p>
                {`Hash: ${router.query.hash}`}
            </p>
        </div>
    );
};

export default ShortenUrl;
