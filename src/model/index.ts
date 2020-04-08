import * as t from 'io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { HistoryLocation } from 'avenger/lib/browser';

export type MenuViewType = 'search' | 'detail';

export type CurrentView = { view: 'search' } | { view: 'detail'; businessId: string };

export type Day = t.TypeOf<typeof Day>;
export type Business = t.TypeOf<typeof Business>;
export type Location = t.TypeOf<typeof Location>;
export type Category = t.TypeOf<typeof Category>;
export type Hour = t.TypeOf<typeof Hour>;
export type OpenValue = t.TypeOf<typeof OpenValue>;

export const Day = t.union(
  [
    t.literal(0),
    t.literal(1),
    t.literal(2),
    t.literal(3),
    t.literal(4),
    t.literal(5),
    t.literal(6)
  ],
  'Day'
);

export const Category = t.type(
  {
    alias: t.string,
    title: t.string
  },
  'Category'
);

export const OpenValue = t.type(
  {
    is_overnight: t.boolean,
    start: t.string,
    end: t.string,
    day: Day
  },
  'OpenValue'
);

export const Hour = t.type(
  {
    open: t.array(OpenValue),
    hours_type: t.string,
    is_open_now: t.boolean
  },
  'Hour'
);

export const Location = t.type(
  {
    address1: t.string,
    address2: optionFromNullable(t.string),
    address3: optionFromNullable(t.string),
    city: t.string,
    zip_code: t.string,
    country: t.string,
    state: t.string,
    display_address: t.array(t.string)
  },
  'Location'
);

export const Business = t.type(
  {
    id: t.string,
    name: t.string,
    image_url: t.string,
    review_count: t.number,
    rating: t.number,
    display_phone: t.string,
    price: t.string,
    location: Location,
    categories: t.array(Category),
    hours: optionFromNullable(t.array(Hour))
  },
  'Business'
);

export function locationToView(location: HistoryLocation): CurrentView {
  switch (location.pathname) {
    case '/detail':
      return location.search.businessId
        ? {
            view: 'detail',
            businessId: location.search.businessId
          }
        : {
            view: 'search'
          };
    default:
      return { view: 'search' };
  }
}

export function viewToLocation(view: CurrentView): HistoryLocation {
  switch (view.view) {
    case 'detail':
      return {
        pathname: '/detail',
        search: {
          businessId: view.businessId
        }
      };
    default:
      return { pathname: '/', search: {} };
  }
}
