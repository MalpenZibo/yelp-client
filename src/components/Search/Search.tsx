import * as React from 'react';
import View from '../View';
import { doUpdateCurrentView } from '../../commands';
import { idIso, Business } from '../../model';

export default class Search extends React.Component {
  goToDetails = () => {
    doUpdateCurrentView({ view: 'detail', businessId: idIso<Business>().wrap("place-holder") }).run();
  };

  render() {
    return (
      <View column hAlignContent="left" className="search">
        <h3>Search</h3>
        <button onClick={() => this.goToDetails()}>Go To Details</button>
      </View>
    );
  }
}
