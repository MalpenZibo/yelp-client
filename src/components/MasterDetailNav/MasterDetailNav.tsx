import * as React from 'react';
import View from '../Basic/View';
import { doUpdateCurrentView } from '../../commands';
import { MenuViewType, CurrentView } from '../../model';
import { Option, none } from 'fp-ts/lib/Option';

import './master-detail-nav.scss';
import Search from '../Search';
import Detail from '../Detail';

type OptionType = { viewType: MenuViewType; label: string };

const master: OptionType = { viewType: 'search', label: 'Search' };
const detail: OptionType = { viewType: 'detail', label: 'Detail' };

type Props = {
  view: CurrentView;
};

type State = {
  term: Option<string>;
  location: Option<string>;
  radius: Option<number>;
};

export default class MasterDetailNav extends React.Component<Props, State> {
  state = {
    term: none,
    location: none,
    radius: none
  };

  goToMaster = () => {
    doUpdateCurrentView({
      view: 'search',
      term: this.state.term,
      location: this.state.location,
      radius: this.state.radius
    }).run();
  };

  setMasterFilter = (value: {
    term: Option<string>;
    location: Option<string>;
    radius: Option<number>;
  }) => {
    this.setState({ ...value });

    doUpdateCurrentView({
      view: 'search',
      term: value.term,
      location: value.location,
      radius: value.radius
    }).run();
  };

  masterDetailHeader = (currentView: CurrentView) => {
    if (currentView.view == detail.viewType) {
      return (
        <View className="nav">
          <a onClick={() => this.goToMaster()}>{master.label}</a>
          <strong>{detail.label}</strong>
        </View>
      );
    } else {
      return <View className="nav">{master.label}</View>;
    }
  };

  content = (currentView: CurrentView) => {
    switch (currentView.view) {
      case 'detail':
        return <Detail businessId={currentView.businessId} />;
      case 'search':
        return (
          <Search
            term={currentView.term}
            location={currentView.location}
            radius={currentView.radius}
            setFilter={this.setMasterFilter}
          />
        );
    }
  };

  render() {
    return (
      <View column className="master-detail-nav">
        <View className="header" vAlignContent="center">
          <h1>Yelp</h1>
          {this.masterDetailHeader(this.props.view)}
        </View>

        <View className="content" grow>
          {this.content(this.props.view)}
        </View>
      </View>
    );
  }
}
