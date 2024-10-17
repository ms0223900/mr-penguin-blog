import React from 'react';

interface Amount {
    amount: number;
    createdAt: string;
}

interface AmountListProps {
    amounts: Amount[];
}

const AmountList: React.FC<AmountListProps> = ({ amounts }) => {
    return (
        <ul className="list-disc pl-5">
            {amounts.map((amount, index) => (
                <li key={index}>
                    Amount: {amount.amount}, Created At: {new Date(amount.createdAt).toLocaleString()}
                </li>
            ))}
        </ul>
    );
};

export default AmountList;
