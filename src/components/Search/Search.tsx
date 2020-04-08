import * as React from 'react';
import { doUpdateCurrentView } from '../../commands';
import { WithQueries } from 'avenger/lib/react';
import { restaurants } from '../../queries/queries';
import { Panel, LoadingSpinner, View, SingleDropdown, Input } from '../Basic';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import _ = require('lodash');

import './search.scss';

type State = {
  searchQuery: string;
  searchInput: string;
  locationQuery: string;
  locationInput: string;
  radiusQuery: { value: number; label: string };
};

const defaultLocation = 'Milan';

const radiusOptions: NonEmptyArray<{ value: number; label: string }> = new NonEmptyArray(
  { value: 5, label: '5 Km' },
  [
    { value: 15, label: '15 Km' },
    { value: 25, label: '25 Km' },
    { value: 40, label: '40 Km' }
  ]
);

class Search extends React.Component<InjectedIntlProps, State> {
  constructor(props: InjectedIntlProps) {
    super(props);

    this.onSearchConfirm = _.debounce(this.onSearchConfirm, 500);
    this.onLocationConfirm = _.debounce(this.onLocationConfirm, 500);
  }
  state = {
    searchQuery: '',
    searchInput: '',
    locationQuery: defaultLocation,
    locationInput: defaultLocation,
    radiusQuery: radiusOptions.head
  };

  goToDetails = (id: string) => {
    doUpdateCurrentView({ view: 'detail', businessId: id }).run();
  };

  onSearchChange = (value: string) => {
    this.setState({ searchInput: value });

    this.onSearchConfirm(value);
  };

  onSearchConfirm = (value: string) => {
    this.setState({ searchQuery: value });
  };

  onLocationChange = (value: string) => {
    this.setState({ locationInput: value });
    if (value.length > 0) {
      this.onLocationConfirm(value);
    }
  };

  onLocationConfirm = (value: string) => {
    this.setState({ locationQuery: value });
  };

  onRadiusChange = (value: { value: number; label: string }) => {
    this.setState({ radiusQuery: value });
  };

  render() {
    const intl = this.props.intl;

    return (
      <View column hAlignContent="left" grow className="search">
        <View className="search-inputs" shrink={false} wrap vAlignContent="center">
          <Input
            placeholder={intl.formatMessage({ id: 'Search.searchLabel' })}
            value={this.state.searchInput}
            onChange={this.onSearchChange}
          />
          <View className="location">
            <View column vAlignContent="center">
              <h5>
                <FormattedMessage id="Search.locationLabel" />
              </h5>
              <Input
                placeholder={intl.formatMessage({ id: 'Search.locationNeeded' })}
                value={this.state.locationInput}
                onChange={this.onLocationChange}
              />
            </View>
            <View column vAlignContent="center">
              <h5>
                <FormattedMessage id="Search.radiusLabel" />
              </h5>
              <SingleDropdown
                value={this.state.radiusQuery}
                onChange={this.onRadiusChange}
                label={intl.formatMessage({ id: 'Search.radiusLabel' })}
                options={radiusOptions.toArray()}
              />
            </View>
          </View>
        </View>

        <WithQueries
          queries={{ restaurants }}
          params={{
            restaurants: {
              searchQuery: this.state.searchQuery,
              locationQuery: this.state.locationQuery,
              radiusQuery: this.state.radiusQuery.value
            }
          }}
          render={queries =>
            queries.fold(
              () => (
                <LoadingSpinner
                  size={45}
                  message={{ content: intl.formatMessage({ id: 'App.loading' }) }}
                />
              ),
              () => (
                <View className="error" hAlignContent="center" vAlignContent="center" grow>
                  <h2>
                    <FormattedMessage id="Search.loadingError" />
                  </h2>
                </View>
              ),
              ({ restaurants }, loading) => (
                <View className="search-result" grow>
                  <View className="list" grow wrap vAlignContent="top">
                    {restaurants.map(r => (
                      <View
                        className="business-card"
                        key={r.id}
                        onClick={() => this.goToDetails(r.id)}
                      >
                        <Panel type="floating" header={{ title: r.name }}>
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
                    ))}
                  </View>

                  {loading ? (
                    <LoadingSpinner
                      size={45}
                      message={{ content: intl.formatMessage({ id: 'App.loading' }) }}
                    />
                  ) : null}
                </View>
              )
            )
          }
        />
      </View>
    );
  }
}

export default injectIntl(Search);
