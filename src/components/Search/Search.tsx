import * as React from 'react';
import View from '../Basic/View';
import { doUpdateCurrentView } from '../../commands';
import { WithQueries } from 'avenger/lib/react';
import { restaurants } from '../../queries/queries';
import { Panel } from '../Basic';
import Input from '../Basic/Input';
import SingleDropdown from '../Basic/SingleDropdown';

import './search.scss';

type State = {
  searchQuery: string,
  searchInput: string,

  locationQuery: string,
  locationInput: string,

  radiusQuery: number,
  radiusInput: { value: number, label: string }
}

const radiusOptions = [
  { value: 5, label: "5 Km" },
  { value: 15, label: "15 Km" },
  { value: 25, label: "25 Km" },
  { value: 40, label: "40 Km" },
];

export default class Search extends React.Component<{}, State> {
  state = { 
    searchQuery: '', searchInput: '',
    locationQuery: 'Milan', locationInput: 'Milan',
    radiusInput: radiusOptions[0],
    radiusQuery: radiusOptions[0].value
  };
  

  goToDetails = (id: string) => {
    doUpdateCurrentView({ view: 'detail', businessId: id }).run();
  };

  render() {
    let searchDelay: ReturnType<typeof setTimeout>;
    let locationDelay: ReturnType<typeof setTimeout>;

    const onSearchChange = (value: string) => {
      this.setState({ searchInput: value });
      clearTimeout(searchDelay)
      searchDelay = setTimeout(() => {
        this.setState({ searchQuery: this.state.searchInput });
      }, 250);
    };

    const onLocationChange = (value: string) => {
      this.setState({ locationInput: value });
      clearTimeout(locationDelay)
      locationDelay = setTimeout(() => {
        this.setState({ locationQuery: this.state.locationInput });
      }, 250);
    };

    const onRadiusChange = (value: { value: number, label: string }) => {
      this.setState({ radiusInput: value, radiusQuery: value.value });
    };

    return (
      <WithQueries
        queries={{ restaurants }}
        params={{ restaurants: { searchQuery: this.state.searchQuery, locationQuery: this.state.locationQuery, radiusQuery :this.state.radiusQuery }}}
        render={queries =>
          queries.fold(
            () => <p>loading</p>,
            () => <p>there was a problem when fetching restaurants</p>,
            ({ restaurants }) => (
              <View column hAlignContent="left" grow={1} className="search">
                <View className="search-inputs">
                  <Input
                    placeholder='Search'
                    value={this.state.searchInput}
                    onChange={onSearchChange}
                  />
                  <Input
                    placeholder='Location'
                    value={this.state.locationInput}
                    onChange={onLocationChange}
                  />
                  <SingleDropdown
                    value={this.state.radiusInput}
                    onChange={onRadiusChange}
                    placeholder="Select radius"
                    options={radiusOptions}
                  />
                </View>
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
