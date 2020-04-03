import * as t from 'io-ts'
import { HistoryLocation } from 'avenger/lib/browser';
import { fromNullable, fromEither } from 'fp-ts/lib/Option';

const unsafeCoerce = <A, B>(a: A): B => a as any

interface Iso<S, A> {
  unwrap: (s: S) => A
  wrap: (a: A) => S
}

type Carrier<N extends Newtype<any, any>> = N['_A']

interface Newtype<URI, A> {
  _URI: URI
  _A: A
}

type AnyNewtype = Newtype<any, any>

const iso = <S extends AnyNewtype>(): Iso<S, Carrier<S>> =>
  ({ wrap: unsafeCoerce, unwrap: unsafeCoerce })

export type UUID = string;
export const UUID = t.string;

export interface Id<A> extends Newtype<{ readonly Id: unique symbol, readonly Id_A: A }, UUID> {}
export function idIso<A>() { return iso<Id<A>>() }

export type MenuViewType =
  | 'search'
  | 'detail'

export type CurrentView = 
  | { view: 'search' }
  | { view: 'detail'; businessId: Id<Business> }

export interface Business {
}

export function locationToView(location: HistoryLocation): CurrentView {
  switch (location.pathname) {
    case '/detail':
      return fromNullable(location.search.businessId)
        .chain(businessId =>
          fromEither(UUID.decode(businessId)).map<CurrentView>(businessId => ({
            view: 'detail',
            businessId: idIso<Business>().wrap(businessId)
          }))
        )
        .getOrElse({
          view: 'search'
        });
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
          businessId: idIso<Business>().unwrap(view.businessId)
        } 
      };
    default:
      return { pathname: '/', search: {} };
  }
}
