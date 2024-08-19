import React, { useState } from 'react';

type CalculatorHook = {
    inputValue: string;
    records: number[];
    handleNumberClick: (numPad: number | string) => void;
    handleBackspace: () => void;
    handleClear: () => void;
    handleOk: () => void;
};

const calculateSum = (input: string): number => {
    const values = input.split('+').map(v => parseFloat(v.trim()));
    return values.reduce((acc, curr) => acc + curr, 0);
};

function useCalculator(): CalculatorHook {
    const [inputValue, setInputValue] = useState('0');
    const [records, setRecords] = useState<number[]>([]);

    const handleOk = () => {
        const handledInputValue = inputValue.includes('+')
            ? calculateSum(inputValue)
            : parseFloat(inputValue);

        if (!isNaN(handledInputValue)) {
            setRecords(prev => [handledInputValue, ...prev]);
            setInputValue('0');
        }
    };

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
    return (
        <div className="text-right text-3xl mb-4 flex justify-end items-center gap-1">
            <span className="text-xl opacity-70">$</span>
            <span>{value}</span>
        </div>
    );
}

function RecordsList({ records }: { records: number[] }) {
    return (
        <div className="w-full bg-white rounded-lg p-4 mb-4 max-h-48 overflow-y-auto">
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
            className={`text-white p-3 rounded text-xl flex items-center justify-center ${className}`}
        >
            {children}
        </button>
    );
}


interface ButtonConfig {
    value: number | string;
    className?: string;
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

    const buttonConfigs: ButtonConfig[] = [
        { value: 7 }, { value: 8 }, { value: 9 },
        { value: 4 }, { value: 5 }, { value: 6 },
        { value: 1 }, { value: 2 }, { value: 3 },
        { value: '.' }, { value: 0 },
        { value: '+', className: 'text-orange-500 text-2xl' }
    ];

    return (
        <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg max-w-xs mx-auto">
            <div className="w-full text-right text-4xl font-bold mb-4 flex items-center justify-end">
                <span className="text-gray-400 mr-1 text-2xl">$</span>
                <span className="text-black">
                    {records.reduce((sum, record) => sum + record, 0)}
                </span>
            </div>
            <RecordsList records={records} />
            <div className="w-full bg-gray-800 text-white p-4 rounded-t-lg">
                <Display value={inputValue} />
                <div className="grid grid-cols-4 gap-2">
                    <div className="col-span-3 grid grid-cols-3 gap-2">
                        {buttonConfigs.map((button) => (
                            <Button
                                key={button.value}
                                onClick={() => handleNumberClick(button.value)}
                                className={`bg-gray-700 ${button.className || ''}`}
                            >
                                {button.value}
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

export default CalculatorMain;
