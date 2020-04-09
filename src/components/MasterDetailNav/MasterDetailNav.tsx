import * as React from 'react';
import View from '../Basic/View';
import { WithQueries } from 'avenger/lib/react';
import { currentView } from '../../queries';
import { doUpdateCurrentView } from '../../commands';
import { constFalse } from 'fp-ts/lib/function';
import { MenuViewType } from '../../model';
import { none } from 'fp-ts/lib/Option';

import './master-detail-nav.scss';

type OptionType = { viewType: MenuViewType; label: string };

const master: OptionType = { viewType: 'search', label: 'Search' };
const detail: OptionType = { viewType: 'detail', label: 'Detail' };

export default class MasterDetailNav extends React.Component {
  goToMaster = () => {
    doUpdateCurrentView({ view: 'search', term: none, location: none, radius: none }).run();
  };

  render() {
    return (
      <WithQueries
        queries={{ currentView }}
        render={queries => {
          const isDetails = queries.fold(
            constFalse,
            constFalse,
            q => q.currentView.view == detail.viewType
          );
          if (isDetails) {
            return (
              <View className="master-detail-nav">
                <a onClick={() => this.goToMaster()}>{master.label}</a>
                <strong>{detail.label}</strong>
              </View>
            );
          } else {
            return <View className="master-detail-nav">{master.label}</View>;
          }
        }}
      />
    );
  }
}
