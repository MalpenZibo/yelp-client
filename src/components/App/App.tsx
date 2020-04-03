import * as React from 'react';
import View from '../View';
import { declareQueries } from 'avenger/lib/react';
import { currentView } from '../../queries';
import { constNull } from 'fp-ts/lib/function';
import Details from '../Detail';
import Search from '../Search';
import MasterDetailNav from '../MasterDetailNav';

import './app.scss';

const queries = declareQueries({ currentView });

class App extends React.Component<typeof queries.Props> {
  render() {
    return (
      <View column className="app">
        <View className="header" vAlignContent='center'>
          <h1>Yeld</h1>
          <MasterDetailNav />
        </View>
        
        {this.props.queries.fold(constNull, constNull, ({ currentView }) => {
          switch (currentView) {
            case 'detail':
              return <Details />;
            case 'search':
              return <Search />;
          }
        })}
      </View>
    );
  }
}


export default queries(App);
