import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './AccountingApp';
import { HistoryItem } from './types';
import { AccountingRepositoryImpl } from './repo/AccountingRepository';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
jest.mock('./repo/AccountingRepository');

async function whenRender() {
  await act(async () => {
    await render(
      <QueryClientProvider client={new QueryClient()}>
        <App />
      </QueryClientProvider>
    );
  });

  await waitFor(() => {
    expect(screen.getByTestId("accounting-app")).toBeInTheDocument();
  });
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

async function whenDoubleClickRecord(recordText: string) {
  const recordElement = (await screen.findByText(recordText)).parentElement;
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
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(AccountingRepositoryImpl.prototype, 'getEntries').mockResolvedValue([]);
  });

  it('renders two components with total amount as $0', async () => {
    await whenRender();

    await waitFor(() => {
      thenAmountShouldBe('$0');
    });
  });

  it('allows input of numbers and updates the display', async () => {
    await whenRender();

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    whenInputNumber(123);

    thenElementShouldExist('$123');
  });

  it('clears the input when AC button is clicked', async () => {
    await whenRender();

    whenInputNumber(12);
    whenClickButton('AC');

    thenAmountShouldBe('$0');
  });

  it('removes last digit when backspace button is clicked', async () => {
    await whenRender();

    whenInputNumber(123);
    whenClickButton('⌫');

    thenElementShouldExist('$12');
  });

  it('shows category selector when OK is clicked', async () => {
    await whenRender();
    whenInputNumber(10);
    whenClickOK();
    thenElementShouldExist('飲食');
    thenElementShouldExist('日用品');
  });

  it('adds new item to history when category is selected and confirms', async () => {
    await whenRender();
    whenInputNumber(10);
    whenClickOK();
    whenSelectCategory('飲食');
    whenClickOK();
    thenCategoryShouldHave('飲食');
    thenAmountShouldBe('$10');
  });

  it('deletes item from history when delete button is clicked', async () => {
    await whenRender();
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

  it('renders multiple account amounts correctly', async () => {
    await whenRender();
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
    await whenRender();

    whenInputNumber(10);
    whenClickOK();
    whenSelectCategory('娛樂');
    whenClickOK();
    thenCategoryShouldHave('娛樂');
    thenAmountShouldBe('$10');

    await whenDoubleClickRecord('娛樂');

    whenClickButton('AC');
    whenInputNumber(12345);
    whenClickOK();
    whenSelectCategory('飲食');
    whenClickOK();

    thenCategoryShouldHave('飲食');
    thenAmountShouldBe('$12345');
    thenElementShouldNotExist('娛樂');
    thenElementShouldNotExist('$10');
  });

  it('only displays one decimal point when multiple are input', async () => {
    await whenRender();
    whenInputNumber(1);
    whenClickButton('.');
    whenClickButton('.');
    whenClickButton('.');
    whenClickButton('.');
    whenInputNumber(1);
    thenElementShouldExist('$1.1');
  });

  it('allows input of decimal numbers starting with 0', async () => {
    await whenRender();
    whenInputNumber(0);
    whenClickButton('.');
    whenInputNumber(1);
    thenElementShouldExist('$0.1');
  });

  it('displays pre-existing accounting entries', async () => {
    const mockEntries: HistoryItem[] = [
      { id: 1, category: '飲食', amount: 100 },
      { id: 2, category: '日用品', amount: 200 },
    ];
    jest.spyOn(AccountingRepositoryImpl.prototype, 'getEntries').mockResolvedValue(mockEntries);

    await whenRender();

    await waitFor(() => {
      thenCategoryShouldHave('飲食');
      thenElementShouldExist('$100');
      thenCategoryShouldHave('日用品');
      thenElementShouldExist('$200');
      thenTotalAmountShouldBe('$300');
    });
  });

  it('saves a new accounting entry and displays it after re-rendering', async () => {
    let historyList: HistoryItem[] = [];
    const ACCOUNTING_ENTRY: HistoryItem = { id: 1, category: '飲食', amount: 100 };

    // 首次渲染應用
    await whenRender();

    // 新增一筆帳目
    whenInputNumber(ACCOUNTING_ENTRY.amount);
    whenClickOK();
    whenSelectCategory(ACCOUNTING_ENTRY.category);
    whenClickOK();

    // 確認帳目已新增
    thenCategoryShouldHave(ACCOUNTING_ENTRY.category);
    thenAmountShouldBe(`$${ACCOUNTING_ENTRY.amount}`);

    // 模擬保存操作
    const mockSaveEntry = jest.spyOn(AccountingRepositoryImpl.prototype, 'saveEntry').mockImplementation(async () => {
      // 模擬保存操作，這裡可以將新帳目加入到歷史列表中
      historyList.push(ACCOUNTING_ENTRY);
    });

    // 初始化空的歷史列表
    jest.spyOn(AccountingRepositoryImpl.prototype, 'getEntries').mockResolvedValue(historyList);

    await waitFor(() => {
      expect(mockSaveEntry).toHaveBeenCalledWith(expect.objectContaining({
        category: ACCOUNTING_ENTRY.category,
        amount: ACCOUNTING_ENTRY.amount
      }));
    });

    // 清除 DOM 並重新渲染應用
    jest.clearAllMocks();
    jest.spyOn(AccountingRepositoryImpl.prototype, 'getEntries').mockResolvedValue(historyList);

    await whenRender();

    // 確認重新渲染後仍能看到該帳目
    await waitFor(() => {
      thenCategoryShouldHave('飲食');
      thenAmountShouldBe('$100');
    });
  });
});

