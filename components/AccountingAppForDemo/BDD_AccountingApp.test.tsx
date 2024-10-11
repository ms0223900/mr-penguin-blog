import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AccountingApp from './AccountingApp';

describe.skip('AccountingApp', () => {
  const givenApplicationIsLaunched = () => {
    render(<AccountingApp />);
  };

  const whenScreenIsDisplayed = () => {
    // 這個步驟不需要額外的操作，因為渲染已經在 given 步驟中完成
  };

  const thenIShouldSeeTwoZeroAmountTexts = () => {
    const zeroAmountTexts = screen.getAllByText('$0');
    expect(zeroAmountTexts).toHaveLength(2);
  };

  const whenIClickButtons = (buttons: string[]) => {
    buttons.forEach(button => {
      const buttonElement = screen.getByText(button);
      fireEvent.click(buttonElement);
    });
  };

  const thenScreenShouldDisplayAmount = (amount: string) => {
    const displayedAmount = screen.getByText(amount);
    expect(displayedAmount).toBeInTheDocument();
  };

  const thenScreenShouldDisplayAmountTwice = (amount: string) => {
    const displayedAmounts = screen.getAllByText(amount);
    expect(displayedAmounts).toHaveLength(2);
  };

  const thenIShouldSeeNewExpenseRecord = (category: string, amount: string) => {
    const categoryElement = screen.getByText(category);
    expect(categoryElement).toBeInTheDocument();
    const amountElements = screen.getAllByText(amount);
    expect(amountElements.length).toBeGreaterThan(0);
  };

  const whenISelectCategory = (category: string) => {
    const categoryButton = screen.getByText(category);
    fireEvent.click(categoryButton);
  };

  it('可以正常輸入數字', () => {
    givenApplicationIsLaunched();
    whenIClickButtons(['1', '2', '3']);
    thenScreenShouldDisplayAmount('$123');
  });

  it('新增一條娛樂支出', async () => {
    givenApplicationIsLaunched();
    whenIClickButtons(['1', '2', '3']);
    whenIClickButtons(['OK']);
    whenISelectCategory('娛樂');
    whenIClickButtons(['OK']);

    thenIShouldSeeNewExpenseRecord('娛樂', '$123');
    thenScreenShouldDisplayAmountTwice('$123');
  });
});
