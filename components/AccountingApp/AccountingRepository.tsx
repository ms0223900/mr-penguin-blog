import { RecordItem } from "./AccountingCalculatorMain";

interface AccountingMapper {
    save: (key: string, data: any) => void;
    get: (key: string) => any;
}

// 新增 AccountingMapper 類別
export class AccountingMapperLocalStorageImpl implements AccountingMapper {
    save(key: string, data: any): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    get(key: string): any {
        if (!localStorage) return null;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
}

// 使用 AccountingMapperImpl
const accountingMapper = new AccountingMapperLocalStorageImpl();

export class AccountingRepository {
    accountingMapper: { save: (key: string, data: any) => void; get: (key: string) => any; };

    constructor(accountingMapper: AccountingMapper) {
        this.accountingMapper = accountingMapper;
    }

    save(records: RecordItem[]) {
        this.accountingMapper.save('accountingRecords', records);
    }

    get() {
        const records = this.accountingMapper.get('accountingRecords');
        return records ? records : [];
    }
}
