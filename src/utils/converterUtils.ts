export async function dataURLtoFile(dataURL: string): Promise<File> {
  // eslint-disable-next-line no-undef
  const blob = await (await fetch(dataURL)).blob();
  const file = new File([blob], `${dataURL}.jpg`, {
    type: 'image/jpeg',
  });

  return file;
}

export const convertBirthDate = (birthday: string, sex: string): string => {
  const yy = birthday.substring(0, 2);
  const mm = birthday.substring(2, 4);
  const dd = birthday.substring(4, 6);

  if (sex === '1' || sex === '2') {
    return `19${yy}-${mm}-${dd}`;
  }
  return `20${yy}-${mm}-${dd}`;
};

export const convertTimeStampDiffString = (timeStamp: number): string => {
  const commentDate = new Date(timeStamp);
  const currentDate = new Date();

  const diffMSec = currentDate.getTime() - commentDate.getTime(); //
  const diffMin = diffMSec / 1000 / 60; // 몇 분 차이
  const diffHour = diffMSec / 1000 / 60 / 60; // 몇 시간 차이
  const diffDay = diffMSec / 1000 / 60 / 60 / 24; // 몇 일 차이
  const diffMonth = diffDay / 30; // 몇 개월 차이
  const diffYear = diffMonth / 12; // 몇 년 차이

  let dateString = '';

  if (Math.floor(diffDay) <= 0) {
    if (Math.floor(diffMin) < 60) {
      if (Math.floor(diffMin) <= 0) {
        dateString = '방금';
      } else {
        dateString = `${Math.floor(diffMin)}분 전`;
      }
    } else {
      dateString = `${Math.floor(diffHour)}시간 전`;
    }
  } else if (Math.floor(diffDay) < 7) {
    dateString = `${Math.floor(diffDay)}일 전`;
  } else if (Math.floor(diffDay) >= 7 && Math.floor(diffDay) < 14) {
    dateString = '1주일 전';
  } else if (Math.floor(diffDay) >= 14 && Math.floor(diffDay) < 21) {
    dateString = '2주일 전';
  } else if (Math.floor(diffDay) >= 21 && Math.floor(diffDay) < 28) {
    dateString = '3주일 전';
  } else if (Math.floor(diffDay) >= 28 && Math.floor(diffDay) < 31) {
    dateString = '1달 전';
  } else if (Math.floor(diffMonth) < 12) {
    dateString = `${Math.floor(diffMonth)}달 전`;
  } else {
    dateString = `${Math.floor(diffYear)}년 전`;
  }
  return dateString;
};

export const convertChannelUrl = (type: string, id: number, writerId, sendbirdId): string => {
  return `p-check_${type}_${id}_${writerId}_${sendbirdId}`;
};

export const phoneWithHyphen = (target?: string): string => {
  if (!target) {
    return '-';
  }
  const phone = target.replace(/-/g, '');
  return phone.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, '$1-$2-$3');
};

export const numberFilterToString = (filter: {
  gte: string | null;
  lte: string | null;
}): string => {
  if (!filter) {
    return '';
  }

  if (filter.gte && filter.lte) {
    return `$btw:${filter.gte},${filter.lte}`;
  }

  if (filter.gte) {
    return `$gte:${filter.gte}`;
  }

  if (filter.lte) {
    return `$lte:${filter.lte}`;
  }

  return '';
};
