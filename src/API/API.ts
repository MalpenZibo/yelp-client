import { TaskEither, tryCatch, fromEither } from 'fp-ts/lib/TaskEither';
import { Business, Review } from '../model';
import axios from 'axios';
import { identity } from 'fp-ts/lib/function';
import * as t from 'io-ts';
import { failure } from 'io-ts/lib/PathReporter';
import { apiEndpoint, apiKey, timeout } from '../config';

export const getRestaurants = (
  searchQuery: string,
  locationQuery: string,
  radiusQuery: number
): TaskEither<unknown, Array<Business>> => {
  return tryCatch(
    () =>
      axios({
        method: 'get',
        url: `${apiEndpoint}/businesses/search`,
        params: {
          location: locationQuery,
          categories: 'restaurants',
          term: searchQuery,
          radius: radiusQuery * 1000
        },
        data: {},
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          Pragma: 'no-cache',
          'Cache-Control': 'no-cache, no-store'
        },
        timeout: timeout
      }),
    identity
  ).chain(res =>
    fromEither(
      t
        .array(Business)
        .decode(res.data.businesses)
        .mapLeft(err => console.log(failure(err).join(' - ')))
    )
  );
};

export const getBusinessDetails = (businessId: string): TaskEither<unknown, Business> => {
  return tryCatch(
    () =>
      axios({
        method: 'get',
        url: `${apiEndpoint}/businesses/${businessId}`,
        params: {},
        data: {},
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          Pragma: 'no-cache',
          'Cache-Control': 'no-cache, no-store'
        },
        timeout: timeout
      }),
    identity
  ).chain(res =>
    fromEither(Business.decode(res.data).mapLeft(err => console.log(failure(err).join(' - '))))
  );
};

export const getReviews = (businessId: string): TaskEither<unknown, Array<Review>> => {
  return tryCatch(
    () =>
      axios({
        method: 'get',
        url: `${apiEndpoint}/businesses/${businessId}/reviews`,
        params: {},
        data: {},
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          Pragma: 'no-cache',
          'Cache-Control': 'no-cache, no-store'
        },
        timeout: timeout
      }),
    identity
  ).chain(res =>
    fromEither(
      t
        .array(Review)
        .decode(res.data.reviews)
        .mapLeft(err => console.log(failure(err).join(' - ')))
    )
  );
};
