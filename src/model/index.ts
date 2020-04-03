/*

You may write here any type that you want to re-use in you application.

ex:

export type Foo = {
  bar: number
}

and in any file:

import { Foo } from 'model'

const foo: Foo = { bar: 5 }



Here we define a type `CurrentView` and two helper functions that are used
in the example app created by default:

*/

import { HistoryLocation } from 'avenger/lib/browser';

export type CurrentView = 'search' | 'detail';

export function locationToView(location: HistoryLocation): CurrentView {
  switch (location.pathname) {
    case '/detail':
      return 'detail';
    default:
      return 'search';
  }
}

export function viewToLocation(view: CurrentView): HistoryLocation {
  switch (view) {
    case 'detail':
      return { pathname: '/detail', search: {} };
    default:
      return { pathname: '/', search: {} };
  }
}
