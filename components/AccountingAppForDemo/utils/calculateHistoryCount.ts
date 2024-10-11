import { HistoryItem } from "../types";

class HistoryListVo {
    historyList: HistoryItem[];

    constructor(historyList: HistoryItem[]) {
        this.historyList = historyList;
    }

    getAllCategoryTotals(): Record<string, number> {
        return this.historyList.reduce((totals, item) => {
            totals[item.category] = (totals[item.category] || 0) + item.amount;
            return totals;
        }, {} as Record<string, number>);
    }

    getCategoryTotalAmount(category: string): number {
        const allCategoryTotals = this.getAllCategoryTotals();
        return allCategoryTotals[category] || 0;
    }
}

export function calculateAllCategoryTotals(historyList: HistoryItem[]): Record<string, number> {
    return historyList.reduce((totals, item) => {
        totals[item.category] = (totals[item.category] || 0) + item.amount;
        return totals;
    }, {} as Record<string, number>);
}

// 使用示例：
// const allCategoryTotals = calculateAllCategoryTotals(historyList);
// console.log(allCategoryTotals);
// 輸出可能如下：{ "飲食": 1000, "娛樂": 500, "交通": 300, ... }