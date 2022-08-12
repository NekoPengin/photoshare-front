const pad = (number: number): string => {
  if (number < 10) {
    return "0" + number;
  }
  return number.toString();
};

const dateTime = (date: Date): string => {
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds())
  );
};

const getMonth = (date: Date): string => {
  return pad(date.getUTCMonth() + 1);
};

export { dateTime, getMonth, pad };
