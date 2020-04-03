/*

This file prepares the app before rendering with React,
adding custom polyfills and setting up the `react-intl` provider.

You shouldn't need to edit this file.

*/

import './polyfills';

// using require to guarantee they're imported after polyfills are installed
// @ts-ignore
const React = require('react');
// @ts-ignore
const ReactDOM = require('react-dom');
// @ts-ignore
const App = require('../components/App').default;
const { IntlProvider } = require('../util/intl');
// @ts-ignore
const { loadLocale } = require('./loadLocale');

// @ts-ignore
require('./addDeviceClassName');
// @ts-ignore
require('../theme');

export function main(mountNode: HTMLElement) {
  ReactDOM.render(
    <IntlProvider loadLocale={loadLocale} locale="it">
      <App />
    </IntlProvider>,
    mountNode
  );
}
