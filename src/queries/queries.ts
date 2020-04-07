import { queryStrict, expire } from 'avenger';
import { getCurrentView } from 'avenger/lib/browser';
import * as API from '../API';
import { locationToView } from '../model';

export const currentView = getCurrentView(locationToView);

export const restaurants = queryStrict(
  (parms: { searchQuery: string; locationQuery: string; radiusQuery: number }) =>
    API.getRestaurants(parms.searchQuery, parms.locationQuery, parms.radiusQuery),
  expire(10000)
);
