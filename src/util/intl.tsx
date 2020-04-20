import * as React from 'react';
import { IntlProvider as IntlIntlProvider } from 'react-intl';

export type _IntlData = {
  locales: string[];
  messages: { [k: string]: string };
};
export type IntlData = _IntlData & { locale: string };

export function addLocaleDataAndResolve(locale: string, resolve: (intlData: IntlData) => void) {
  return (intl: _IntlData) => {
    if (!Intl.PluralRules) {
      require('@formatjs/intl-pluralrules/polyfill');
      require('@formatjs/intl-pluralrules/dist/locale-data/de'); // Add locale data for de
    }

    //@ts-ignore
    if (!Intl.RelativeTimeFormat) {
      require('@formatjs/intl-relativetimeformat/polyfill');
      require('@formatjs/intl-relativetimeformat/dist/locale-data/de'); // Add locale data for de
    }

    resolve({ ...intl, locale });
  };
}

export type Props = {
  locale: string;
  loadLocale: (locale: string) => Promise<IntlData>;
  children: any;
};

export class IntlProvider extends React.Component<Props> {
  state: { intlData?: IntlData } = {};

  componentDidMount() {
    this.props.loadLocale(this.props.locale).then(intlData => {
      this.setState({ intlData });
    });
  }

  render() {
    return this.state.intlData ? (
      <IntlIntlProvider {...this.state.intlData}>{this.props.children}</IntlIntlProvider>
    ) : null;
  }
}
