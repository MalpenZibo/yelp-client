import { addLocaleDataAndResolve, IntlData } from '../util/intl';

/*

In this `loadLocale` function we import the required locale data for our app.
This function ensures only the required files are loaded based on the locale we want to serve to the user.

The stesp to add a new locale (language) are:
- create a new file in `locales`, such as `myLang.json`. It should respect the format of the other locale files
- add the new `case` in the function below.
The documentation for `react-intl/locale-data` packages can be found at https://github.com/yahoo/react-intl/wiki#loading-locale-data

*/

//type Locale = 'it' | 'en';

export function loadLocale(locale: string) {
  return new Promise<IntlData>(resolve => {
    switch (locale) {
      case 'it':
        // @ts-ignore
        return require(['../locales/it'], addLocaleDataAndResolve(locale, resolve));
      case 'en':
      default:
        // @ts-ignore
        return require(['../locales/en'], addLocaleDataAndResolve(locale, resolve));
    }
  });
}
