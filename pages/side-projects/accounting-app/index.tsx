"use client"
import React, { useState } from 'react';

function useCalculator() {
    const [inputValue, setInputValue] = useState('0');
    const [records, setRecords] = useState([123, 111, 10, 1]);

    const handleNumberClick = (numPad: number | string) => {
        setInputValue(prev => 
            prev === '0' ? numPad.toString() : prev + numPad
        );
    };

    const handleBackspace = () => {
        setInputValue(prev => prev.slice(0, -1));
    };

    const handleClear = () => {
        setInputValue('0');
    };

    const handleOk = () => {
        const newValue = parseFloat(inputValue);
        setRecords(prev => [newValue, ...prev]);
        setInputValue('0');
    };

    return {
        inputValue,
        records,
        handleNumberClick,
        handleBackspace,
        handleClear,
        handleOk
    };
}

// 开闭原则：将 UI 组件分离，便于未来扩展
function Display({ value }: { value: string }) {
    return <div className="text-right text-3xl mb-4">${value}</div>;
}

function RecordsList({ records }: { records: number[] }) {
    return (
        <div className="w-full bg-white rounded-lg p-4 mb-4">
            {records.slice(0, 4).map((record, index) => (
                <div key={index} className="text-right text-xl mb-2">
                    ${record}
                </div>
            ))}
        </div>
    );
}

function Button({ onClick, className, children }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            onClick={onClick}
            className={`text-white p-3 rounded ${className}`}
        >
            {children}
        </button>
    );
}

function CalculatorMain() {
    const {
        inputValue,
        records,
        handleNumberClick,
        handleBackspace,
        handleClear,
        handleOk
    } = useCalculator();

    return (
        <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg max-w-xs mx-auto">
            <div className="w-full text-right text-4xl font-bold mb-4">
                ${records[0] || 0}
            </div>
            <RecordsList records={records} />
            <div className="w-full bg-gray-800 text-white p-4 rounded-t-lg">
                <Display value={inputValue} />
                <div className="grid grid-cols-4 gap-2">
                    <div className="col-span-3 grid grid-cols-3 gap-2">
                        {[7, 8, 9, 4, 5, 6, 1, 2, 3, '.', 0, '+'].map((btn, index) => (
                            <Button
                                key={index}
                                onClick={() => handleNumberClick(btn)}
                                className="bg-gray-700"
                            >
                                {btn}
                            </Button>
                        ))}
                    </div>
                    <div className="grid grid-rows-4 gap-2">
                        <Button onClick={handleClear} className="bg-orange-500">AC</Button>
                        <Button onClick={handleBackspace} className="bg-gray-600">X</Button>
                        <Button onClick={handleOk} className="bg-blue-500 row-span-2">OK</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const AccountingAppIndex: React.FC = (props) => {
    return (
        <div>
            <h1>Accounting :)</h1>

            <CalculatorMain />
        </div>
    );
};

export default AccountingAppIndex;
