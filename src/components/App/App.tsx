/*

This component is the entry point for our app.
It must be named exactly `App` and live in the `components/App` folder.
Typical tasks performed in this component are:
- general app layout
- choosing the correct component to render based on the current view

In this simple example it does a bit of both.

*/

import * as React from 'react';
import View from '../View';
import SwitchViewDropdown from '../SwitchViewDropdown';
import Hello from '../Hello';
import { declareQueries } from 'avenger/lib/react';
import { currentView } from '../../queries';
import { constNull } from 'fp-ts/lib/function';

import './app.scss';

const queries = declareQueries({ currentView });

class App extends React.Component<typeof queries.Props> {
  render() {
    return (
      <View column className="app">
        <h1>Bento App</h1>
        <SwitchViewDropdown />
        {this.props.queries.fold(constNull, constNull, ({ currentView }) => {
          switch (currentView) {
            case 'hello':
              return <Hello />;
            case 'home':
              return null;
          }
        })}
      </View>
    );
  }
}

export default queries(App);
