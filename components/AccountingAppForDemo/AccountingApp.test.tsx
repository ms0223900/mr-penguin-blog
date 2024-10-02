import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './AccountingApp';

function whenRender() {
  render(<App />);
}

function whenInputNumber(number: number) {
  number.toString().split('').forEach(digit => {
    fireEvent.click(screen.getByText(digit));
  });
}

function whenClickOK() {
  fireEvent.click(screen.getByText('OK'));
}

function whenSelectCategory(category: string) {
  fireEvent.click(screen.getByText(category));
}

function whenClickButton(buttonText: string) {
  fireEvent.click(screen.getByText(buttonText));
}

function whenDoubleClickRecord(recordText: string) {
  const recordElement = screen.getByText(recordText).parentElement;
  if (recordElement) {
    userEvent.dblClick(recordElement);
  } else {
    throw new Error('Record element not found');
  }
}

function thenCategoryShouldHave(category: string) {
  expect(screen.getByText(category)).toBeInTheDocument();
}

function thenAmountShouldBe(amount: string) {
  expect(screen.getAllByText(amount)).toHaveLength(2);
}

function thenTotalAmountShouldBe(amount: string) {
  expect(screen.getByText(amount)).toBeInTheDocument();
}

function thenElementShouldExist(text: string) {
  expect(screen.getByText(text)).toBeInTheDocument();
}

function thenElementShouldNotExist(text: string) {
  expect(screen.queryByText(text)).not.toBeInTheDocument();
}

describe('AccountingApp', () => {
  it('renders two components with total amount as $0', () => {
    whenRender();

    thenAmountShouldBe('$0');
  });

  it('allows input of numbers and updates the display', () => {
    whenRender();

    whenInputNumber(123);

    thenElementShouldExist('$123');
  });

  it('clears the input when AC button is clicked', () => {
    whenRender();

    whenInputNumber(12);
    whenClickButton('AC');

    thenAmountShouldBe('$0');
  });

  it('removes last digit when backspace button is clicked', () => {
    whenRender();

    whenInputNumber(123);
    whenClickButton('⌫');

    thenElementShouldExist('$12');
  });

  it('shows category selector when OK is clicked', () => {
    whenRender();
    whenInputNumber(10);
    whenClickOK();
    thenElementShouldExist('飲食');
    thenElementShouldExist('日用品');
  });

  it('adds new item to history when category is selected and confirms', () => {
    whenRender();
    whenInputNumber(10);
    whenClickOK();
    whenSelectCategory('飲食');
    whenClickOK();
    thenCategoryShouldHave('飲食');
    thenAmountShouldBe('$10');
  });

  it('deletes item from history when delete button is clicked', () => {
    whenRender();
    whenInputNumber(10);
    whenClickOK();
    whenSelectCategory('飲食');
    whenClickOK();
    thenCategoryShouldHave('飲食');
    thenAmountShouldBe('$10');
    whenClickButton('刪除');
    thenElementShouldNotExist('飲食');
    thenElementShouldNotExist('$10');
  });

  it('renders multiple account amounts correctly', () => {
    whenRender();
    whenInputNumber(10);
    whenClickOK();
    whenSelectCategory('飲食');
    whenClickOK();
    whenInputNumber(20);
    whenClickOK();
    whenSelectCategory('日用品');
    whenClickOK();
    thenElementShouldExist('$10');
    thenElementShouldExist('$20');
    thenTotalAmountShouldBe('$30');
  });

  it('allows editing of an existing record by double-clicking', async () => {
    whenRender();
    whenInputNumber(10);
    whenClickOK();
    whenSelectCategory('娛樂');
    whenClickOK();
    thenCategoryShouldHave('娛樂');
    thenAmountShouldBe('$10');
    await whenDoubleClickRecord('娛樂');
    whenClickButton('AC');
    whenInputNumber(20);
    whenClickOK();
    whenSelectCategory('飲食');
    whenClickOK();
    thenCategoryShouldHave('飲食');
    thenAmountShouldBe('$20');
    thenElementShouldNotExist('娛樂');
    thenElementShouldNotExist('$10');
  });
});

