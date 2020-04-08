import { expire, queryShallow } from 'avenger';
import { getCurrentView } from 'avenger/lib/browser';
import * as API from '../API';
import { locationToView } from '../model';

export const currentView = getCurrentView(locationToView);

export const restaurants = queryShallow(
  (params: { searchQuery: string; locationQuery: string; radiusQuery: number }) =>
    API.getRestaurants(params.searchQuery, params.locationQuery, params.radiusQuery),
  expire(10000)
);

export const business = queryShallow(
  (params: { businessId: string }) => API.getBusinessDetails(params.businessId),
  expire(10000)
);
