import DateValidator from './DateValidator';

export enum AscDescEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

type SortByDateFnParam = Parameters<typeof DateValidator.validateInput>[0];

const SortingHelpers = {
  makeSortComparison:
    (prev: number, next: number) =>
    (ascDesc = AscDescEnum.DESC): number => {
      if (prev === next) return 0;
      return ascDesc === AscDescEnum.ASC ? prev - next : next - prev;
    },

  sortByDateFn(ascDesc = AscDescEnum.DESC) {
    return (prevDate: SortByDateFnParam, nextDate: SortByDateFnParam) => {
      const _prevTime = DateValidator.validateInput(prevDate).getTime();
      const _nextTime = DateValidator.validateInput(nextDate).getTime();

      return this.makeSortComparison(_prevTime, _nextTime)(ascDesc);
    };
  },
};

export default SortingHelpers;
