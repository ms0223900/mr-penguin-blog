import { HistoryItem } from "../types";
import { calculateFoodAndEntertainmentCatogoryCount, calculateFoodCatogoryCount } from "./calculateHistoryCount";

describe('calculateFoodCategoryCount', () => {
    it('should return 0 when the history list is empty', () => {
        const historyList: HistoryItem[] = [];
        const result = calculateFoodCatogoryCount(historyList);
        expect(result).toBe(0);
    });

    it('should correctly calculate the amount for food category', () => {
        const historyList: HistoryItem[] = [
            { amount: 100, category: '飲食', id: 1 },
            { amount: 50, category: '娛樂', id: 2 },
            { amount: 200, category: '飲食', id: 3 },
        ];
        const result = calculateFoodCatogoryCount(historyList);
        expect(result).toBe(300);
    });

    it('should return 0 when there are no items in the food category', () => {
        const historyList: HistoryItem[] = [
            { amount: 50, category: '娛樂', id: 1 },
            { amount: 20, category: '交通', id: 2 },
        ];
        const result = calculateFoodCatogoryCount(historyList);
        expect(result).toBe(0);
    });

    it('should correctly calculate the amount for multiple food category items', () => {
        const historyList: HistoryItem[] = [
            { amount: 30, category: '飲食', id: 1 },
            { amount: 70, category: '飲食', id: 2 },
            { amount: 20, category: '日用品', id: 3 },
        ];
        const result = calculateFoodCatogoryCount(historyList);
        expect(result).toBe(100);
    });
});

describe('calculateFoodAndEntertainmentCatogoryCount', () => {
    it('should return 0 when the history list is empty', () => {
        const historyList: HistoryItem[] = [];
        const result = calculateFoodAndEntertainmentCatogoryCount(historyList);
        expect(result).toEqual({ foodCategoryTotalAmount: 0, entertainmentCategoryTotalAmount: 0 });
    });

    it('should correctly calculate the amount for food and entertainment category', () => {
        const historyList: HistoryItem[] = [
            { amount: 100, category: '飲食', id: 1 },
            { amount: 50, category: '娛樂', id: 2 },
            { amount: 200, category: '飲食', id: 3 },
            { amount: 150, category: '娛樂', id: 4 },
        ];
        const result = calculateFoodAndEntertainmentCatogoryCount(historyList);
        expect(result).toEqual({ foodCategoryTotalAmount: 300, entertainmentCategoryTotalAmount: 200 });
    });

    it('should correctly calculate the amount for multiple food and entertainment category items', () => {
        const historyList: HistoryItem[] = [
            { amount: 30, category: '飲食', id: 1 },
            { amount: 70, category: '飲食', id: 2 },
            { amount: 20, category: '日用品', id: 3 },
            { amount: 100, category: '娛樂', id: 4 },
            { amount: 150, category: '娛樂', id: 5 },
        ];
        const result = calculateFoodAndEntertainmentCatogoryCount(historyList);
        expect(result).toEqual({ foodCategoryTotalAmount: 100, entertainmentCategoryTotalAmount: 250 });
    });
});