/*

This components reuses two other "basic" components that we defined in our
app's `components` folder: View and Dropdown.

It also reads and updates the `CurrentView` data state we defined,
using the dedicated query, command, helpers and types defined respectively in
`queries`, `commands` and `model`.

*/

import * as React from 'react';
import View from '../View';
import Dropdown from '../Dropdown';
import { WithQueries } from 'avenger/lib/react';
import { currentView } from '../../queries';
import { doUpdateCurrentView } from '../../commands';
import { CurrentView } from '../../model';
import { constNull } from 'fp-ts/lib/function';

type OptionType = { value: CurrentView; label: string };

const options: Array<OptionType> = [
  {
    value: 'home',
    label: 'Home'
  },
  {
    value: 'hello',
    label: 'Hello'
  }
];

export default class SwitchViewDropdown extends React.Component {
  onChange = (value: OptionType) => {
    doUpdateCurrentView(value.value).run();
  };

  render() {
    return <WithQueries queries={{currentView}} render={queries => {
      const currentView = queries.fold(constNull, constNull, q => q.currentView);
      const value = options.find(o => o.value === currentView) || options[0];
      return (
        <View className="switch-view-dropdown">
          <Dropdown options={options} value={value} onChange={this.onChange} />
        </View>
      );
    }} />
  }
}
