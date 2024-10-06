import { HistoryItem } from "../types";


interface AccountingRepository {
    getEntries: () => Promise<HistoryItem[]>;
    saveEntry: (entry: HistoryItem) => Promise<void>;
}

export class AccountingRepositoryImpl implements AccountingRepository {
    async getEntries(): Promise<HistoryItem[]> {
        return Promise.resolve([]);

        // return new Promise((resolve) => {
        //     setTimeout(() => {
        //         resolve([
        //             { id: 1, amount: 100, category: "飲食" },
        //             { id: 2, amount: 200, category: "交通" },
        //             { id: 3, amount: 300, category: "娛樂" },
        //         ]);
        //     }, 1000);
        // });
    }

    async saveEntry(entry: HistoryItem): Promise<void> {
        // 實作邏輯，例如將 entry 儲存到資料庫
        console.log("Saving entry:", entry);
    }
}
