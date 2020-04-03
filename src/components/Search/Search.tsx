import * as React from 'react';
import View from '../Basic/View';
import { doUpdateCurrentView } from '../../commands';
import { UUID } from 'io-ts-types/lib/UUID';
import { CurrentView } from 'src/model';

export default class Search extends React.Component {
  goToDetails = () => {
    doUpdateCurrentView(
      UUID.decode('00000000-0000-0000-0000-000000000000').fold<CurrentView>(
        () => ({ view: 'search' }),
        (businessId) => ({ 
          view: 'detail', 
          businessId: businessId
        })
      )
    ).run();
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
