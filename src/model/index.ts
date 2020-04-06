import * as t from 'io-ts'
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable'
import { HistoryLocation } from 'avenger/lib/browser';

export type MenuViewType =
  | 'search'
  | 'detail'

export type CurrentView = 
  | { view: 'search' }
  | { view: 'detail'; businessId: string }

export type Location = t.TypeOf<typeof Location>
export type Business = t.TypeOf<typeof Business>

export const Location = t.type({
  address1: t.string,
  address2: optionFromNullable(t.string),
  address3: optionFromNullable(t.string),
  city: t.string,
  zip_code: t.string,
  country: t.string,
  state: t.string,
  display_address: t.array(t.string)
}, 'Location')

export const Business = t.type({
  id: t.string,
  name: t.string,
  image_url: t.string,
  review_count: t.number,
  rating: t.number,
  display_phone: t.string,
  location: Location
}, 'Business')

export function locationToView(location: HistoryLocation): CurrentView {
  switch (location.pathname) {
    case '/detail':
      return location.search.businessId ?
      {
        view: 'detail',
        businessId: location.search.businessId
      }
      :
      {
        view: 'search'
      }
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
