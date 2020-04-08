import * as React from 'react';
import View from '../Basic/View';
import { InjectedIntlProps, injectIntl } from 'react-intl';

class Detail extends React.Component<InjectedIntlProps> {
  render() {
    return (
      <View column className="detail">
        <h3>Detail</h3>
      </View>
    );
  }
}

export default injectIntl(Detail);
