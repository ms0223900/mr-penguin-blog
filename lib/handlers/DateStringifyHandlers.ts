import REGEX from 'lib/regex';
import DateValidator, { DateInput } from './DateValidator';

export enum FormattedDateStrType {
  YEAR = 'YEAR',
  MONTH = 'MONTH',
  DATE = 'DATE',
}

const DateStringifyHandlers = {
  parseFormat: (format = 'YYYY-MM-DD') => {
    const devider = (() => {
      const matchedList = format.match(REGEX.dateDevider);
      if (matchedList && matchedList.length > 0) {
        return matchedList[0];
      }
      return '-';
    })();

    const devided = format.split(devider);
    const typeList = devided.map((d) => {
      if (d.match(/y/gi)) {
        return FormattedDateStrType.YEAR;
      }
      if (d.match(/m/gi)) {
        return FormattedDateStrType.MONTH;
      }
      return FormattedDateStrType.DATE;
    });

    return {
      typeList,
      devider,
    };
  },

  fillZero: (num = 1) => num.toString().padStart(2, '0'),

  getStrByFormattedType(date: Date, type: FormattedDateStrType) {
    switch (type) {
      case FormattedDateStrType.YEAR:
        return date.getFullYear().toString();
      case FormattedDateStrType.MONTH:
        return this.fillZero(date.getMonth() + 1);
      case FormattedDateStrType.DATE:
        return this.fillZero(date.getDate());
      default:
        '';
    }
  },

  stringify(date: DateInput, format = 'MM-DD') {
    const _date = DateValidator.validateInput(date);
    const { typeList, devider } = this.parseFormat(format);
    const dateStrList = typeList.map((t) =>
      this.getStrByFormattedType(_date, t)
    );
    const res = dateStrList.join(devider);
    return res;
  },
};

export default DateStringifyHandlers;
