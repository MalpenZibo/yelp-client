import * as t from 'io-ts'
import { HistoryLocation } from 'avenger/lib/browser';
import { UUID } from 'io-ts-types/lib/UUID'

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
      return UUID.decode(location.search.businessId).fold<CurrentView>(
        () => {
          return { view: 'search' };
        },
        (businessId) => {
          return {
            view: 'detail',
            businessId: businessId
          };
        }
      )
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
