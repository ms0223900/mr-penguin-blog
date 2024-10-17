import React from 'react';
import { AmountSubmission } from './types';

interface AmountListProps {
    amounts: AmountSubmission[];
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
