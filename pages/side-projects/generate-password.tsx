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
                // "bg-gray-300",
                "flex flex-col items-center",
            )
        }>
            <div className={
                clsx("p-4 text-center",
                    "flex items-center gap-2",
                    "border-solid border-b-gray-300 border-b-2"
                )
            }>
                <h3>
                    Random Password:
                </h3>
                <p className={"text-lg"}>
                    {password}
                </p>
            </div>
            <hr />
            <label className={
                clsx("p-2 py-4")
            }>
                <span>Password Length: </span>
                <input
                    className={"p-2 px-4"}
                    type="number"
                    value={pwdLength}
                    min={MIN_PWD_LENGTH}
                    max={MAX_PWD_LENGTH}
                    onChange={handlePwdLengthChanged}
                />
            </label>
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
