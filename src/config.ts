import * as t from 'io-ts';
/*
export const CONFIG = {
  apiEndpoint: t.string.decode(process.env.REACT_APP_apiEndpoint).getOrElse(''),
  apiKey: t.string.decode(process.env.REACT_APP_apiKey).getOrElse(''),
  timeout: t.number.decode(process.env.REACT_APP_timeout).getOrElse(600000)
};
*/
export const apiEndpoint = t.string.decode(process.env.REACT_APP_apiEndpoint).getOrElse('');
export const apiKey = t.string.decode(process.env.REACT_APP_apiKey).getOrElse('');
export const timeout = t.number.decode(process.env.REACT_APP_timeout).getOrElse(600000);
