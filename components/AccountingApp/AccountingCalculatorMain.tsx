import React, { useState } from 'react';

type CalculatorHook = {
    inputValue: string;
    records: number[];
    handleNumberClick: (numPad: number | string) => void;
    handleBackspace: () => void;
    handleClear: () => void;
    handleOk: () => void;
};

function useCalculator(): CalculatorHook {
    const [inputValue, setInputValue] = useState('0');
    const [records, setRecords] = useState<number[]>([]);

    const handleNumberClick = (numPad: number | string) => {
        setInputValue(prev =>
            prev === '0' ? numPad.toString() : prev + numPad
        );
    };

    const handleBackspace = () => {
        setInputValue(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    };

    const handleClear = () => {
        setInputValue('0');
    };

    const handleOk = () => {
        const newValue = parseFloat(inputValue);
        if (!isNaN(newValue)) {
            setRecords(prev => [newValue, ...prev].slice(0, 4));
            setInputValue('0');
        }
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

function Display({ value }: { value: string }) {
    return <div className="text-right text-3xl mb-4">${value}</div>;
}

function RecordsList({ records }: { records: number[] }) {
    return (
        <div className="w-full bg-white rounded-lg p-4 mb-4">
            {records.length > 0 ? (
                records.map((record, index) => (
                    <div key={index} className="text-right text-xl mb-2">
                        ${record}
                    </div>
                ))
            ) : (
                <div className="text-right text-xl text-gray-400">No records</div>
            )}
        </div>
    );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
}

function Button({ onClick, className, children }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`text-white p-3 rounded text-xl ${className}`}
        >
            {children}
        </button>
    );
}

export function CalculatorMain() {
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
                        <Button onClick={handleBackspace} className="bg-gray-600 flex items-center justify-center">
                            {"X"}
                        </Button>
                        <Button onClick={handleOk} className="bg-blue-500 row-span-2">OK</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CalculatorMain;
