import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { IntlProvider } from './util/intl';
import { loadLocale } from './setup/loadLocale';
import ReactDOM from 'react-dom';
import React from 'react';

import './theme/index';

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
