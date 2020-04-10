import * as t from 'io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { HistoryLocation } from 'avenger/lib/browser';
import { Option, some, none, fromNullable } from 'fp-ts/lib/Option';
import { IntFromString } from 'io-ts-types/lib/IntFromString';

export type MenuViewType = 'search' | 'detail';

export type CurrentView =
  | { view: 'search'; term: Option<string>; location: Option<string>; radius: Option<RadiusValue> }
  | { view: 'detail'; businessId: string };

export type SearchFilters = {
  term: Option<string>;
  location: Option<string>;
  radius: Option<RadiusValue>;
};

export type RadiusValue = t.TypeOf<typeof RadiusValue>;
export type Day = t.TypeOf<typeof Day>;
export type Business = t.TypeOf<typeof Business>;
export type Location = t.TypeOf<typeof Location>;
export type Category = t.TypeOf<typeof Category>;
export type Hour = t.TypeOf<typeof Hour>;
export type OpenValue = t.TypeOf<typeof OpenValue>;

export const RadiusValue = t.union(
  [t.literal(5), t.literal(15), t.literal(25), t.literal(40)],
  'RadiusValue'
);

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
    price: optionFromNullable(t.string),
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
            view: 'search',
            term: none,
            location: none,
            radius: none
          };
    case '/search':
      return {
        view: 'search',
        term: fromNullable(location.search.term),
        location: fromNullable(location.search.location),
        radius: IntFromString.decode(location.search.radius)
          .chain(RadiusValue.decode)
          .fold(
            _ => none,
            value => some(value)
          )
      };
    default:
      return { view: 'search', term: none, location: none, radius: none };
  }
}

export function viewToLocation(view: CurrentView): HistoryLocation {
  switch (view.view) {
    case 'search':
      return {
        pathname: 'search',
        search: {
          term: view.term.toUndefined(),
          location: view.location.toUndefined(),
          radius: view.radius.fold(undefined, radius => radius.toString())
        }
      };
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
