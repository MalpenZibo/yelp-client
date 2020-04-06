/*

In this file we can define all the avenger queries that are needed in our app.

*/

import { queryStrict, available } from 'avenger';
import { getCurrentView } from 'avenger/lib/browser';
import * as API from '../API';
import { locationToView } from '../model';

export const currentView = getCurrentView(locationToView);

export const randomName = queryStrict(
  // `queryStrict` will call this API when requested (declared in a component),
  // and use a "strict" comparison to compare input and retrieve cached results.
  // See https://github.com/buildo/avenger/blob/v5/README.md#queries
  API.getRandomName,
  // using the `available` cache strategy means this value will be cached in memory
  // indefinitely after it is fetched for the first time
  available
);
