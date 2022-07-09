import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export const toDateTime24HourMinStrComma = (dateStr: string): string => {
  return dayjs(dateStr).isValid() ? dayjs(dateStr).format('YYYY.MM.DD HH:mm') : '';
};

export const toDateTimeHourMinStrComma = (dateStr: string): string => {
  return dayjs(dateStr).isValid() ? dayjs(dateStr).format('YYYY.MM.DD h:mm a') : '';
};

export const toDateTimeStrComma = (dateStr: string): string => {
  return dayjs(dateStr).isValid() ? dayjs(dateStr).format('YYYY.MM.DD') : '';
};

export const toDateStr = (dateStr: string): string => {
  return dayjs(dateStr).isValid() ? dayjs(dateStr).format('YY년 MM월 DD일') : '';
};

export const isPast12hours = (dateStr: string): boolean => {
  return dayjs().utc().diff(dayjs(dateStr), 'h') >= 12;
};

export const convertToKorean = (beforeDateTime: string): string => {
  const compareDateTime = dayjs.utc(beforeDateTime).tz('Asia/Seoul');
  const now = dayjs().utc().tz('Asia/Seoul');

  const seconds = Math.abs(compareDateTime.diff(now, 'seconds'));
  if (seconds >= 0 && seconds < 60) {
    return '방금';
  }

  const minutes = Math.abs(compareDateTime.diff(now, 'minutes'));

  if (minutes > 0 && minutes < 60) {
    return `${minutes}분전`;
  }

  const hours = Math.abs(compareDateTime.diff(now, 'hours'));

  if (hours > 0 && hours < 24) {
    return `${hours}시간전`;
  }

  const days = Math.abs(compareDateTime.diff(now, 'days'));

  if (days > 0 && days < 4) {
    return `${days}일전`;
  }

  return compareDateTime.format('YY.MM.DD');
};
