import React, { useState, useEffect, useMemo } from 'react';
import AmountList from './AmountList';
import { AmountSubmission } from './types';

const AdvancedCounter: React.FC = () => {
    const [inputAmount, setInputAmount] = useState<string>('');
    const [amounts, setAmounts] = useState<AmountSubmission[]>([]);

    const totalCount = useMemo(() => amounts.reduce((sum, amount) => sum + amount.amount, 0), [amounts]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputAmount(e.target.value);
    };

    const handleSubmit = () => {
        const amount = parseInt(inputAmount);
        if (!isNaN(amount)) {
            const newSubmission: AmountSubmission = {
                amount,
                createdAt: new Date().toISOString()
            };
            setAmounts([...amounts, newSubmission]);
            setInputAmount('');
        }
    };

    return (
        <div className="py-4">
            <div className="mb-4">
                <input
                    type="number"
                    value={inputAmount}
                    onChange={handleInputChange}
                    className="border rounded px-2 py-1 mr-2"
                    placeholder="Enter amount"
                />
                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Submit
                </button>
            </div>
            <div className="mb-4">
                <h3 className="text-xl font-semibold">Total Count: {totalCount}</h3>
            </div>
            <div>
                <h3 className="text-xl font-semibold mb-2">Amount History:</h3>
                <AmountList amounts={amounts} />
            </div>
        </div>
    );
};

export default AdvancedCounter;
