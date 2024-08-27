import { RecordItem } from "./AccountingCalculatorMain";

interface AccountingMapper {
    save: (data: any) => void;
    get: () => any;
}

// 新增 AccountingMapper 類別
export class AccountingMapperLocalStorageImpl implements AccountingMapper {
    private key = 'accountingRecords';

    save(data: any): void {
        localStorage.setItem(this.key, JSON.stringify(data));
    }

    get(): any {
        if (!localStorage) return null;
        const data = localStorage.getItem(this.key);
        return data ? JSON.parse(data) : null;
    }
}


export class AccountingRepository {
    accountingMapper: AccountingMapper;

    constructor(accountingMapper: AccountingMapper) {
        this.accountingMapper = accountingMapper;
    }

    save(records: RecordItem[]) {
        this.accountingMapper.save(records);
    }

    get() {
        const records = this.accountingMapper.get();
        return records ? records : [];
    }
}
