import { expire, queryShallow, queryStrict } from 'avenger';
import { getCurrentView } from 'avenger/lib/browser';
import * as API from '../API';
import { locationToView } from '../model';

export const currentView = getCurrentView(locationToView);

export const restaurants = queryShallow(
  (params: { searchQuery: string; locationQuery: string; radiusQuery: number }) =>
    API.getRestaurants(params.searchQuery, params.locationQuery, params.radiusQuery),
  expire(10000)
);

export const business = queryStrict(API.getBusinessDetails, expire(10000));

export const reviews = queryStrict(API.getReviews, expire(10000));
