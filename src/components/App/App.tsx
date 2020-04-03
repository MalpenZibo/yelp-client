import * as React from 'react';
import View from '../Basic/View';
import { declareQueries } from 'avenger/lib/react';
import { currentView } from '../../queries';
import { constNull } from 'fp-ts/lib/function';
import Details from '../Detail';
import Search from '../Search';
import MasterDetailNav from '../MasterDetailNav';
import ScrollView from '../Basic/ScrollView';

import './app.scss';

const queries = declareQueries({ currentView });

class App extends React.Component<typeof queries.Props> {
  render() {
    return (
      <View column className="app">
        <View className="header" vAlignContent='center'>
          <h1>Yelp</h1>
          <MasterDetailNav />
        </View>
        
        <ScrollView className="content">
          {this.props.queries.fold(constNull, constNull, ({ currentView }) => {
            switch (currentView.view) {
              case 'detail':
                return <Details />;
              case 'search':
                return <Search />;
            }
          })}
        </ScrollView>
      </View>
    );
  }
}


export default queries(App);
