import * as React from 'react';
import View from '../Basic/View';
import { declareQueries } from 'avenger/lib/react';
import { currentView } from '../../queries';
import { constNull } from 'fp-ts/lib/function';
import MasterDetailNav from '../MasterDetailNav';

import './app.scss';

const queries = declareQueries({ currentView });

class App extends React.Component<typeof queries.Props> {
  render() {
    return this.props.queries.fold(constNull, constNull, ({ currentView }) => (
      <View column className="app">
        <MasterDetailNav view={currentView} />
      </View>
    ));
  }
}

export default queries(App);
