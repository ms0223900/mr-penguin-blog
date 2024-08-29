import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CalculatorMain from './AccountingCalculatorMain';
import { AccountingRepository } from './AccountingRepository';

const spyRepoGet = jest.spyOn(AccountingRepository.prototype, 'get');

describe('CalculatorMain', () => {
    beforeEach(() => {
        spyRepoGet.mockReturnValue([]);
    });

    it('renders correctly', () => {
        render(<CalculatorMain />);
        expect(screen.getByText('No records')).toBeInTheDocument();
    });

    it('handles number click', () => {
        render(<CalculatorMain />);
        const button = screen.getByText('7');
        fireEvent.click(button);
        expect(screen.getByText('7')).toHaveLength(2);
    });

    it('handles backspace', () => {
        render(<CalculatorMain />);
        const button = screen.getByText('7');
        fireEvent.click(button);
        expect(screen.queryAllByText('0')).toHaveLength(2)

        const backspaceButton = screen.getByRole('backspaceButton');
        fireEvent.click(backspaceButton);
        expect(screen.getByText('0')).toHaveLength(3)
    });

    it('handles clear', () => {
        render(<CalculatorMain />);

        const button = screen.getByText('7');
        fireEvent.click(button);
        const clearButton = screen.getByText('AC');
        expect(screen.queryAllByText('0')).toHaveLength(2)

        fireEvent.click(clearButton);
        expect(screen.getByText('0')).toHaveLength(3)
    });

    it('handles adding records', () => {
        render(<CalculatorMain />);

        const button = screen.getByText('7');
        fireEvent.click(button);

        const okButton = screen.getByRole('button', { name: /ok/i });
        fireEvent.click(okButton);

        const categorySelectorButton = screen.getByText('早餐');
        fireEvent.click(categorySelectorButton);

        const categoryOkButton = screen.getByTestId("categoryOkButton");
        fireEvent.click(categoryOkButton);
        
        expect(screen.getByText(/7/)).toHaveLength(3);
    });
});
