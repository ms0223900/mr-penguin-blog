type DateInput = number | string | Date | null | undefined;

const DateValidator = {
  handleDateStrForSafari: (dateInput?: DateInput): DateInput => {
    if (typeof dateInput === 'string') {
      const YYYYMMDD = dateInput.match(/\d+/g);
      if (YYYYMMDD && YYYYMMDD.length === 3) {
        return YYYYMMDD.join('/');
      }
    }
    return dateInput;
  },

  validateInput(dateInput?: DateInput): Date {
    // console.log(dateInput);
    const now = new Date();
    const handledDateInput = this.handleDateStrForSafari(dateInput);
    if (!handledDateInput) return now;

    const date = new Date(handledDateInput);
    if (Number.isNaN(date.getTime())) {
      return now;
    }
    return date;
  },

  validateYearMonth(year: string | number, month: string | number): boolean {
    if (!Number.isNaN(year) || !Number.isNaN(month)) return false;
    return true;
  },
};

export default DateValidator;
