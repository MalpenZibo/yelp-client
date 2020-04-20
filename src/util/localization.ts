import { IntlShape } from 'react-intl';
import { Day } from '../model';

export function formatDay(intl: IntlShape, day: Day): string {
  switch (day) {
    case 0:
      return intl.formatMessage({ id: 'Day.monday' });
    case 1:
      return intl.formatMessage({ id: 'Day.tuesday' });
    case 2:
      return intl.formatMessage({ id: 'Day.wednesday' });
    case 3:
      return intl.formatMessage({ id: 'Day.thursday' });
    case 4:
      return intl.formatMessage({ id: 'Day.friday' });
    case 5:
      return intl.formatMessage({ id: 'Day.saturday' });
    case 6:
      return intl.formatMessage({ id: 'Day.sunday' });
  }
}
