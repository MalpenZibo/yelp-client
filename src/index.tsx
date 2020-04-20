import './setup/polyfills';
// from old index: using require to guarantee they're imported after polyfills are installed
// need test or use old style

/*
// using require to guarantee they're imported after polyfills are installed
// @ts-ignore
const React = require('react');
// @ts-ignore
const ReactDOM = require('react-dom');
// @ts-ignore
const App = require('./components/App').default;
const { IntlProvider } = require('./util/intl');
// @ts-ignore
const { loadLocale } = require('./setup/loadLocale');
// @ts-ignore
const { serviceWorker } = require('./serviceWorker');

// @ts-ignore
require('./setup/addDeviceClassName');
// @ts-ignore
require('./theme');
*/

import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { IntlProvider } from './util/intl';
import { loadLocale } from './setup/loadLocale';
import ReactDOM from 'react-dom';
import React from 'react';
import './setup/addDeviceClassName';

import './theme';

ReactDOM.render(
  <React.StrictMode>
    <IntlProvider loadLocale={loadLocale} locale="it">
      <App />
    </IntlProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
