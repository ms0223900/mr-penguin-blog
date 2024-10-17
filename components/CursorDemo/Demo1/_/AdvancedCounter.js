import React, { useState, useEffect } from 'react';
import AmountList from './AmountList';

const AdvancedCounter = () => {
    const [inputAmount, setInputAmount] = useState('');
    const [amounts, setAmounts] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    const handleInputChange = (e) => {
        setInputAmount(e.target.value);
    };

    const handleSubmit = () => {
        const amount = parseInt(inputAmount);
        if (!isNaN(amount)) {
            const newSubmission = {
                amount,
                createdAt: new Date().toISOString()
            };
            setAmounts([...amounts, newSubmission]);
            setInputAmount('');
        }
    };

    useEffect(() => {
        const newTotal = amounts.reduce((sum, amount) => sum + amount.amount, 0);
        setTotalCount(newTotal);
    }, [amounts]);

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
