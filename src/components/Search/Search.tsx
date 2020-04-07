import * as React from 'react';
import { doUpdateCurrentView } from '../../commands';
import { WithQueries } from 'avenger/lib/react';
import { restaurants } from '../../queries/queries';
import { Panel, LoadingSpinner, View, Input, SingleDropdown } from '../Basic';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'

import './search.scss';

type State = {
  searchQuery: string,
  searchInput: string,

  locationQuery: string,
  locationInput: string,

  radiusQuery: { value: number, label: string }
}

const radiusOptions: NonEmptyArray<{ value: number, label: string}> = new NonEmptyArray(
  { value: 5, label: "5 Km" },
  [
    { value: 15, label: "15 Km" },
    { value: 25, label: "25 Km" },
    { value: 40, label: "40 Km" },
  ]
);

class Search extends React.Component<InjectedIntlProps, State> {
  state = { 
    searchQuery: '', searchInput: '',
    locationQuery: 'Milan', locationInput: 'Milan',
    radiusQuery: radiusOptions.head
  };
  
  goToDetails = (id: string) => {
    doUpdateCurrentView({ view: 'detail', businessId: id }).run();
  };

  render() {
    const intl = this.props;

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
      this.setState({ radiusQuery: value });
    };

    return (
      <WithQueries
        queries={{ restaurants }}
        params={{ restaurants: { 
          searchQuery: this.state.searchQuery, 
          locationQuery: this.state.locationQuery, 
          radiusQuery: this.state.radiusQuery.value 
        }}}
        render={queries =>
          queries.fold(
            () => (
              <LoadingSpinner
                size={45}
                message={{ content: intl.intl.formatMessage({ id: "App.loading" })}}
              />
            ),
            () => (
              <View hAlignContent="center" vAlignContent="center" grow={1}>
                <h2><FormattedMessage id="Search.loadingError" /></h2>
              </View>
            ),
            ({ restaurants }) => (
              <View column hAlignContent="left" grow={1} className="search">
                <View className="search-inputs" shrink={0} wrap={true} vAlignContent="center">
                  <Input
                    placeholder='Search'
                    value={this.state.searchInput}
                    onChange={onSearchChange}
                  />
                  <View className="location">
                    <View column vAlignContent="center">
                      <h5><FormattedMessage id="Search.locationLabel" /></h5>
                      <Input
                        placeholder='Location'
                        value={this.state.locationInput}
                        onChange={onLocationChange}
                      />
                    </View>
                    <View column vAlignContent="center">
                      <h5><FormattedMessage id="Search.radiusLabel" /></h5>
                      <SingleDropdown
                        value={this.state.radiusQuery}
                        onChange={onRadiusChange}
                        label="Radius"
                        placeholder="Select radius"
                        options={radiusOptions.toArray()}
                      />
                    </View>
                  </View>
                </View>
                <View className="list" grow={1} wrap={true} vAlignContent="top">
                  {restaurants.map(
                    r => 
                      <View key={r.id} onClick={() => this.goToDetails(r.id)}>
                        <Panel className="business-card" type="floating" header={{title: r.name}}>
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

export default injectIntl(Search);