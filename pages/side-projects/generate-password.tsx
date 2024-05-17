'use client'
import React, { useState } from 'react';
import { RandomHashPassword } from "./RandomHashPassword";
import clsx from "clsx";

const MIN_PWD_LENGTH = 8;
const MAX_PWD_LENGTH = 16;

const GeneratePassword: React.FC = (props) => {
    const [pwdLength, setPwdLength] = useState(MIN_PWD_LENGTH);
    const [password, setPassword] = useState('');

    function handleGenerateRandPwd() {
        const pwd = new RandomHashPassword().generate({
            length: pwdLength
        });
        setPassword(pwd)
        // TODO, copy
    }

    function handlePwdLengthChanged(e: any) {
        setPwdLength(e.target.value)

    }

    return (
        <div className={
            clsx("pt-10 min-h-[400px]",
                "flex flex-col items-center"
            )
        }>
            <div className={"p-4 text-center"}>
                <h3>
                    Password:
                </h3>
                <p className={"text-lg"}>
                    {password}
                </p>
                <hr />
            </div>
            <input
                type="number"
                value={pwdLength}
                min={MIN_PWD_LENGTH}
                max={MAX_PWD_LENGTH}
                onChange={handlePwdLengthChanged}
            />
            <button className={
                clsx(
                    "max-w-[400px]",
                    "px-5 py-3 bg-cyan-800 text-white",
                    "rounded-lg",
                    "font-bold"
                )
            } onClick={handleGenerateRandPwd}>
                Generate and Copy:)
            </button>
        </div>
    );
};

export default GeneratePassword;
