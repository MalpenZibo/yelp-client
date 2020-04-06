import { queryStrict, expire } from 'avenger';
import { getCurrentView } from 'avenger/lib/browser';
import * as API from '../API';
import { locationToView } from '../model';

export const currentView = getCurrentView(locationToView);

export const restaurants = queryStrict(
  (searchQuery: string) => API.getRestaurants(searchQuery),
  expire(10000)
);