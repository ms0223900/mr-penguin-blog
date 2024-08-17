"use client"
import React from 'react';
import { CalculatorMain } from "components/AccountingApp/AccountingCalculatorMain";

const AccountingAppIndex: React.FC = (props) => {
    return (
        <div>
            <h1>Accounting :)</h1>

            <CalculatorMain />
        </div>
    );
};

export default AccountingAppIndex;
