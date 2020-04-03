import * as t from 'io-ts'
import { HistoryLocation } from 'avenger/lib/browser';

export type UUID = string;
export const UUID = t.string;

export type MenuViewType =
  | 'search'
  | 'detail'

export type CurrentView = 
  | { view: 'search' }
  | { view: 'detail'; businessId: UUID }

export interface Business {
  id: UUID
}

export const Business = t.type({
  id: UUID,
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
        { view: 'search' }
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
