import { HistoryItem } from "../types";
import { calculateAllCategoryTotals } from "./calculateHistoryCount";

describe('calculateAllCategoryTotals', () => {
    it('should return an empty object when the history list is empty', () => {
        const historyList: HistoryItem[] = [];
        const result = calculateAllCategoryTotals(historyList);
        expect(result).toEqual({});
    });

    it('should correctly calculate totals for 8 categories with 20 items', () => {
        const historyList: HistoryItem[] = [
            { amount: 100, category: '飲食', id: 1 },
            { amount: 200, category: '娛樂', id: 2 },
            { amount: 150, category: '交通', id: 3 },
            { amount: 300, category: '購物', id: 4 },
            { amount: 50, category: '醫療', id: 5 },
            { amount: 80, category: '教育', id: 6 },
            { amount: 120, category: '住宿', id: 7 },
            { amount: 90, category: '其他', id: 8 },
            { amount: 110, category: '飲食', id: 9 },
            { amount: 180, category: '娛樂', id: 10 },
            { amount: 130, category: '交通', id: 11 },
            { amount: 250, category: '購物', id: 12 },
            { amount: 70, category: '醫療', id: 13 },
            { amount: 100, category: '教育', id: 14 },
            { amount: 140, category: '住宿', id: 15 },
            { amount: 60, category: '其他', id: 16 },
            { amount: 95, category: '飲食', id: 17 },
            { amount: 175, category: '娛樂', id: 18 },
            { amount: 85, category: '交通', id: 19 },
            { amount: 215, category: '購物', id: 20 },
        ];

        const result = calculateAllCategoryTotals(historyList);

        expect(result).toEqual({
            '飲食': 305,
            '娛樂': 555,
            '交通': 365,
            '購物': 765,
            '醫療': 120,
            '教育': 180,
            '住宿': 260,
            '其他': 150
        });
    });

    it('should return undefined for non-existent categories', () => {
        const historyList: HistoryItem[] = [
            { amount: 100, category: '飲食', id: 1 },
            { amount: 200, category: '娛樂', id: 2 },
        ];

        const result = calculateAllCategoryTotals(historyList);

        expect(result['飲食']).toBe(100);
        expect(result['娛樂']).toBe(200);
        expect(result['不存在的類別']).toBeUndefined();
    });
});