import { HistoryItem } from "../types";

export function calculateFoodCatogoryCount(historyList: HistoryItem[]) {
    let foodCategoryTotalAmount = 0;
    for (const item of historyList) {
        if (item.category === "飲食") {
            foodCategoryTotalAmount += item.amount;
        }
    }
    return foodCategoryTotalAmount;
}

export function calculateFoodAndEntertainmentCatogoryCount(historyList: HistoryItem[]) {
    let foodCategoryTotalAmount = 0;
    let entertainmentCategoryTotalAmount = 0;

    for (const item of historyList) {
        if (item.category === "飲食") {
            foodCategoryTotalAmount += item.amount;
        }
        if (item.category === "娛樂") {
            entertainmentCategoryTotalAmount += item.amount;
        }
    }
    return { foodCategoryTotalAmount, entertainmentCategoryTotalAmount };
}