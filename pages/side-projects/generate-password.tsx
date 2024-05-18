'use client'
import React, { useEffect, useState } from 'react';
import { RandomHashPassword } from "../../lib/functions/RandomHashPassword";
import clsx from "clsx";

const MIN_PWD_LENGTH = 8;
const MAX_PWD_LENGTH = 16;
const DEFAULT_PWD_LENGTH = 12;

function copyToClipboard(text: string) {
    const inputEL = document.createElement('input');
    inputEL.value = text
    document.body.appendChild(inputEL)
    inputEL.select()
    document.execCommand('copy')
    document.body.removeChild(inputEL)
}

const GeneratePassword: React.FC = (props) => {
    const [pwdLength, setPwdLength] = useState(DEFAULT_PWD_LENGTH);
    const [password, setPassword] = useState('');
    const [withSpecialChar, setWithSpecialChar] = useState(true);

    function handleGenerateRandPwd() {
        const pwd = new RandomHashPassword().generate({
            length: pwdLength,
            withSpecialChar: withSpecialChar,
        });
        setPassword(pwd)

        copyToClipboard(pwd);
    }

    const handlePwdLengthChanged = (e: any) => {
        setPwdLength(e.target.value)
    };

    const handleCheckSpecialChar = (e: any) => {
        const checked = e.target.checked;
        setWithSpecialChar(checked)
    };

    const handleCopy = () => {
        copyToClipboard(password);
    };

    useEffect(() => {
        handleGenerateRandPwd()
    }, [])

    return (
        <div className={
            clsx("pt-10 min-h-[83vh]",
                // "bg-gray-300",
                "flex flex-col items-center",
            )
        }>
            <div className={
                clsx("p-4 text-center",
                    "flex items-center justify-center gap-2 flex-wrap",
                    "border-solid border-b-gray-300 border-b-2"
                )
            }>
                <h3>
                    Random Password:
                </h3>
                <div className={
                    clsx("flex gap-2 items-center",
                        "p-2"
                    )
                }>
                    <p className={"text-lg"} onClick={handleCopy}>
                        {password}
                    </p>
                    <button className={"text-cyan-400 font-bold"} onClick={handleCopy}>Copy</button>
                </div>
            </div>
            <hr />
            <div className={clsx(
                "pt-4"
            )}>
                <button className={
                    clsx(
                        "w-[400px]",
                        "px-5 py-3 bg-cyan-800 text-white",
                        "rounded-lg",
                        "font-bold"
                    )
                } onClick={handleGenerateRandPwd}>
                    Generate
                </button>
            </div>
            <div className={
                clsx("py-2",
                    "flex flex-col flex-gap-1 justify-center"
                )
            }>
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
                <label className={"flex gap-1"}>
                    <input
                        type={"checkbox"}
                        checked={withSpecialChar}
                        onChange={handleCheckSpecialChar}
                    />
                    <span>With special Char</span>
                </label>
            </div>
        </div>
    );
};

export default GeneratePassword;
