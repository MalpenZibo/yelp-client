import { TaskEither, tryCatch, fromEither } from 'fp-ts/lib/TaskEither';
import { Business } from '../model';
import axios from 'axios'
import * as config from '../config'
import { identity } from 'fp-ts/lib/function'
import * as t from 'io-ts'
import { failure } from 'io-ts/lib/PathReporter';

export const getRestaurants = (searchQuery: string): TaskEither<unknown, Array<Business>> => {
  return tryCatch(() =>
      axios({
        method: 'get',
        url: `${config.apiEndpoint}/businesses/search`,
        params: {
          location: "Milan",
          categories: "restaurants",
          term: searchQuery
        },
        data: {

        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache, no-store'
        },
        timeout: config.timeout
      }), 
      identity
    )
    .chain(res => fromEither(t.array(Business).decode(res.data.businesses).mapLeft(err => console.log(failure(err).join(' - ')))))
};
