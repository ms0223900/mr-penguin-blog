'use client'
import React, { useState } from 'react';
import { RandomHashPassword } from "./RandomHashPassword";

const GeneratePassword: React.FC = (props) => {
    const [password, setPassword] = useState('');

    function handleGenerateRandPwd() {
        const pwd = new RandomHashPassword().generate();
        setPassword(pwd)
    }

    return (
        <div>
            <h3>
                {password}
            </h3>
            <button onClick={handleGenerateRandPwd}>
                Generate :)
            </button>
        </div>
    );
};

export default GeneratePassword;
