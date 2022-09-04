const MakeDataListHelpers = {
    makeArrData<Data>(makeSingleDataFn: ((idx: number, ...params: any) => Data), amount: number): Data[] {
        return Array(amount).fill(0).map((a, idx) => (
            makeSingleDataFn(idx)
        ));
    },

    getDataByIdx<Data>(dataList: Data[], idx = 0): Data {
        return dataList[idx % (dataList.length)];
    },
};

export default MakeDataListHelpers;
