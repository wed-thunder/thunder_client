import _ from 'lodash';

const pToMeter = 3.305785; // 평대비미터배율

// 금액 3자리 마다 , 찍기
export const numberWithCommas = (target: number | string): string => {
  if (!target) {
    return '';
  }

  const number: string = typeof target === 'string' ? target.replace(/,/g, '') : target.toString();
  const numbers = number.split('.');
  const integerPart = numbers[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (numbers.length > 1) {
    return `${integerPart}.${numbers[1]}`;
  }
  return integerPart;
};
/**
 * 금액을 한글 단위로 보여줌
 *
 * @param target 금액
 *
 * E.g., 1212340567 => 12억 1,234만 567원
 */
export const numberToKorean = (
  target: number | string,
  noComma = false,
  noValueType = false,
): string => {
  let number: number;
  let isNegative = false;
  if (typeof target === 'string') {
    number = _.toNumber(target.replace(/,/g, ''));
  } else {
    number = target;
  }

  if (_.isNaN(number)) {
    return '';
  }

  if (number === 0) {
    return '0원';
  }

  if (number < 0) {
    isNegative = true;
    number = Math.abs(number);
  }
  const unitWords = ['', '만', '억', '조', '경'];
  const splitUnit = 10000;

  const resultArray = unitWords.map((__, index) => {
    const unitResult = Math.floor(number / splitUnit ** index) % splitUnit;
    const kNumber = noComma ? `${unitResult}` : numberWithCommas(unitResult);

    return unitResult > 0 ? kNumber + unitWords[index] : undefined;
  });

  return `${isNegative ? '-' : ''}${_.filter(resultArray.reverse(), (v) => v).join(' ')}${
    noValueType ? '' : '원'
  }`;
};

export const toNumber = (target: number | string = 0): number => {
  if (!target) {
    return 0;
  }
  if (typeof target === 'number') {
    return target;
  }
  return Number(target.replace(/,/g, ''));
};

export const meterToPyeong = (meter: number | string, precision = 2): number => {
  return _.round(toNumber(meter) / pToMeter, precision);
};

export const pyeongToMeter = (pyeong?: number): string => {
  return `${_.round((pyeong || 0) * pToMeter, 2).toString()}`;
};

export function withComma(target: number | string | undefined | null): string {
  if (target === 0) {
    return '0';
  }
  if (!target) {
    return '';
  }
  const number: string = typeof target === 'string' ? target.replace(/,/g, '') : target.toString();

  const numbers = number.split('.');
  const integerPart = numbers[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (numbers.length > 1) {
    return `${integerPart}.${numbers[1]}`;
  }
  return integerPart;
}

export function attachNumberWithPyeong(
  target: number | string | undefined | null,
  precision?: boolean,
): string {
  if (!target) {
    return '-';
  }

  const pyeongNumber = precision
    ? meterToPyeong(toNumber(target))
    : meterToPyeong(toNumber(target), 0);

  if (!pyeongNumber) {
    return '-';
  }

  return `${withComma(pyeongNumber)}평`;
}

export const cleanPhoneNumber = (phoneNumber: string): string => {
  return phoneNumber.split('-').join('');
};

export function isNumber(value: string | number): boolean {
  if (value === undefined || value === null || value === '') {
    return false;
  }

  if (_.isNaN(Number(String(value)))) {
    return false;
  }

  return true;
}

export const removeCommaString = (value: string): string => {
  const result = value.replace(/,/g, '');
  return result;
};
