import React from 'react';
import PropTypes from 'prop-types';

const AmountList = ({ amounts }) => {
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

AmountList.propTypes = {
    amounts: PropTypes.arrayOf(
        PropTypes.shape({
            amount: PropTypes.number.isRequired,
            createdAt: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default AmountList;
