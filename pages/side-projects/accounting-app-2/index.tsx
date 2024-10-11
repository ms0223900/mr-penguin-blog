"use client"
import React from 'react';
import CalculatorMain from "components/AccountingAppForDemo/AccountingApp";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const client = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 0,
            refetchOnWindowFocus: false,
        },
    },
});

const AccountingAppIndex: React.FC = (props) => {
    return (
        <div className='min-h-screen'>
            <h1>Accounting :)</h1>

            <QueryClientProvider client={client}><CalculatorMain /></QueryClientProvider>
        </div>
    );
};

export default AccountingAppIndex;
