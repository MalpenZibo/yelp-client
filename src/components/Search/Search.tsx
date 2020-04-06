import * as React from 'react';
import View from '../Basic/View';
import { doUpdateCurrentView } from '../../commands';
import { WithQueries } from 'avenger/lib/react';
import { restaurants } from '../../queries/queries';
import { Panel } from '../Basic';

import './search.scss';
import Input from '../Basic/Input';

type State = {
  searchQuery: string,
  userInput: string
}

export default class Search extends React.Component<{}, State> {
  constructor() {
    super({});
    this.state = { searchQuery: '', userInput: '' }
  }

  goToDetails = (id: string) => {
    doUpdateCurrentView({ view: 'detail', businessId: id }).run();
  };

  render() {
    let timeout: ReturnType<typeof setTimeout>;

    const onChange = (value: string) => {
      this.setState({ userInput: value });
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.setState({ searchQuery: this.state.userInput });
      }, 250);
    };

    return (
      <WithQueries
        queries={{ restaurants }}
        params={{ restaurants: this.state.searchQuery }}
        render={queries =>
          queries.fold(
            () => <p>loading</p>,
            () => <p>there was a problem when fetching restaurants</p>,
            ({ restaurants }) => (
              <View column hAlignContent="left" grow={1} className="search">
                <Input
                  placeholder='Search'
                  value={this.state.userInput}
                  onChange={onChange}
                />
                <View className="list" grow={1} wrap={true} vAlignContent="top">
                  {restaurants.map(
                    r => 
                      <View onClick={() => this.goToDetails(r.id)}>
                        <Panel className="business-card" type="floating" header={{title: r.name}} key={r.id}>
                          <View column>
                            <View>
                              <img src={`${r.image_url}`} />
                              <View className="review" column vAlignContent="top">
                                <p>Rating: {r.rating}</p>
                                <p>Review: {r.review_count}</p>
                              </View>
                            </View>
                            <View column>
                              <p>Address: {r.location.display_address.join(' ')}</p>
                            </View>
                          </View>
                        </Panel>
                      </View>
                  )}
                </View>
              </View>
            )
          )
        }
      />
    );
  }
}
