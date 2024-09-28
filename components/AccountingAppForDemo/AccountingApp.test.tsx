import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './AccountingApp';

describe('AccountingApp', () => {
  it('renders two components with total amount as $0', () => {
    render(<App />);
    const totalElements = screen.getAllByText('$0');
    expect(totalElements).toHaveLength(2);
  });

  it('allows input of numbers and updates the display', () => {
    render(<App />);
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('3'));
    expect(screen.getByText('$123')).toBeInTheDocument();
  });

  it('clears the input when AC button is clicked', () => {
    render(<App />);
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('AC'));
    const totalElements = screen.getAllByText('$0');
    expect(totalElements).toHaveLength(2);
  });

  it('removes last digit when backspace button is clicked', () => {
    render(<App />);
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByText('⌫'));
    expect(screen.getByText('$12')).toBeInTheDocument();
  });

  it('shows category selector when OK is clicked', () => {
    render(<App />);
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('0'));
    fireEvent.click(screen.getByText('OK'));
    expect(screen.getByText('飲食')).toBeInTheDocument();
    expect(screen.getByText('日用品')).toBeInTheDocument();
  });

  it('adds new item to history when category is selected', () => {
    render(<App />);
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('0'));
    fireEvent.click(screen.getByText('OK'));
    fireEvent.click(screen.getByText('飲食'));
    expect(screen.getByText('飲食')).toBeInTheDocument();
    expect(screen.getByText('$10')).toBeInTheDocument();
  });

  it('deletes item from history when delete button is clicked', async () => {
    render(<App />);
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('0'));
    fireEvent.click(screen.getByText('OK'));
    
    fireEvent.click(screen.getByText('飲食'));
    fireEvent.click(screen.getByText('OK'));
    
    const deleteButton = screen.getByText('刪除');
    fireEvent.click(deleteButton);
    
    expect(screen.queryByText('飲食')).not.toBeInTheDocument();
    expect(screen.queryByText('$10')).not.toBeInTheDocument();
  });

  it('renders multiple account amounts correctly', () => {
    render(<App />);

    // Add first amount
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('0'));
    fireEvent.click(screen.getByText('OK'));
    fireEvent.click(screen.getByText('飲食'));
    fireEvent.click(screen.getByText('OK')); // 按下 OK 確認第一筆

    // Add second amount
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('0'));
    fireEvent.click(screen.getByText('OK'));
    fireEvent.click(screen.getByText('日用品'));
    fireEvent.click(screen.getByText('OK')); // 按下 OK 確認第二筆

    // Check if both amounts are rendered
    expect(screen.getByText('$10')).toBeInTheDocument();
    expect(screen.getByText('$20')).toBeInTheDocument();

    // Check if the total amount is correct
    expect(screen.getByText('$30')).toBeInTheDocument();
  });

  it('allows editing of an existing record by double-clicking', async () => {
    render(<App />);

    // Add initial record: $10 for entertainment
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('0'));
    fireEvent.click(screen.getByText('OK'));
    fireEvent.click(screen.getByText('娛樂'));
    fireEvent.click(screen.getByText('OK'));

    // Verify initial record
    expect(screen.getByText('娛樂')).toBeInTheDocument();
    expect(screen.getAllByText('$10')).toHaveLength(2); // Check for two instances of $10

    // Double-click to edit
    const recordElement = screen.getByText('娛樂').parentElement;
    if (recordElement) {
      await userEvent.dblClick(recordElement);
    } else {
      throw new Error('Record element not found');
    }

    // 先歸零
    fireEvent.click(screen.getByText('AC')); // 清除當前金額
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('0'));
    fireEvent.click(screen.getByText('OK'));

    // Change category to food
    fireEvent.click(screen.getByText('飲食'));
    fireEvent.click(screen.getByText('OK'));

    // Verify edited record
    expect(screen.getByText('飲食')).toBeInTheDocument();
    expect(screen.getAllByText('$20')).toHaveLength(2); // Check for two instances of $20

    // Verify old record is gone
    expect(screen.queryByText('娛樂')).not.toBeInTheDocument();
    expect(screen.queryByText('$10')).not.toBeInTheDocument();
  });
});
