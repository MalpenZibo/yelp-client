import * as React from 'react';
import View from '../View';
import { WithQueries } from 'avenger/lib/react';
import { currentView } from '../../queries';
import { doUpdateCurrentView } from '../../commands';
import { constNull } from 'fp-ts/lib/function';
import { CurrentView } from 'src/model';

import './master-detail-nav.scss';

type OptionType = { value: CurrentView; label: string };

const master: OptionType = { value: 'search', label: 'Search' }
const detail: OptionType = { value: 'detail', label: 'Detail' }

export default class MasterDetailNav extends React.Component {
  goToMaster = () => {
    doUpdateCurrentView(master.value).run();
  };

  render() {
    return <WithQueries queries={{currentView}} render={queries => {
      const isDetails = queries.fold(constNull, constNull, q => q.currentView == 'detail');
      if (isDetails) {
        return (
          <View className="master-detail-nav"><a onClick={() => this.goToMaster()}>{master.label}</a><strong>{detail.label}</strong></View>
        );
      } else {
        return (
          <View className="master-detail-nav">{master.label}</View>
        );
      }
    }} />
  }
}
