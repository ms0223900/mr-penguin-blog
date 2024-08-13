import React, { useState } from 'react';


function CalculatorMain() {
    const [inputValue, setInputValue] = useState('3134111');
    const [records, setRecords] = useState([123, 111, 10, 1]);

    const handleNumberClick = (numPad: number | string) => {
        setInputValue(prev => prev + numPad);
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

    return (
        <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg max-w-xs mx-auto">
            <div className="w-full text-right text-4xl font-bold mb-4">
                ${records[0] || 0}
            </div>
            <div className="w-full bg-white rounded-lg p-4 mb-4">
                {records.slice(0, 4).map((record, index) => (
                    <div key={index} className="text-right text-xl mb-2">
                        ${record}
                    </div>
                ))}
            </div>
            <div className="w-full bg-gray-800 text-white p-4 rounded-t-lg">
                <div className="text-right text-3xl mb-4">${inputValue}</div>
                <div className="grid grid-cols-4 gap-2">
                    {[7, 8, 9, 4, 5, 6, 1, 2, 3, '.', 0, '+'].map((btn) => (
                        <button
                            key={btn}
                            onClick={() => handleNumberClick(btn)}
                            className="bg-gray-700 text-white p-3 rounded"
                        >
                            {btn}
                        </button>
                    ))}
                    <button onClick={handleClear} className="bg-orange-500 text-white p-3 rounded">
                        AC
                    </button>
                    <button onClick={handleBackspace} className="bg-gray-600 text-white p-3 rounded">
                        {"X"}
                    </button>
                    <button onClick={handleOk} className="bg-blue-500 text-white p-3 rounded col-span-2">
                        OK
                    </button>
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
