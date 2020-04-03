import * as React from 'react';
import View from '../View';
import { doUpdateCurrentView } from '../../commands';

export default class Search extends React.Component {
  goToDetails = () => {
    doUpdateCurrentView('detail').run();
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
