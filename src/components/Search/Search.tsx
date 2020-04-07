import * as React from 'react';
import { doUpdateCurrentView } from '../../commands';
import { WithQueries } from 'avenger/lib/react';
import { restaurants } from '../../queries/queries';
import { Panel, LoadingSpinner, View, ConfirmationInput, SingleDropdown } from '../Basic';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';

import './search.scss';

type State = {
  searchInput: string;
  searchQuery: string;
  locationInput: string;
  locationQuery: string;
  radiusQuery: { value: number; label: string };
};

const radiusOptions: NonEmptyArray<{ value: number; label: string }> = new NonEmptyArray(
  { value: 5, label: '5 Km' },
  [
    { value: 15, label: '15 Km' },
    { value: 25, label: '25 Km' },
    { value: 40, label: '40 Km' }
  ]
);

class Search extends React.Component<InjectedIntlProps, State> {
  state = {
    searchInput: '',
    searchQuery: '',
    locationInput: 'Milan',
    locationQuery: 'Milan',
    radiusQuery: radiusOptions.head
  };

  goToDetails = (id: string) => {
    doUpdateCurrentView({ view: 'detail', businessId: id }).run();
  };

  onSearchChange = (value: string) => {
    this.setState({ searchInput: value });
  };

  onSearchConfirm = (value: string) => {
    this.setState({ searchQuery: value });
  };

  onSearchClear = () => {
    this.setState({ searchQuery: '' });
  };

  onLocationChange = (value: string) => {
    this.setState({ locationInput: value });
  };

  onLocationConfirm = (value: string) => {
    this.setState({ locationQuery: value });
  };

  onLocationClear = () => {
    this.setState({ locationQuery: '' });
  };

  onRadiusChange = (value: { value: number; label: string }) => {
    this.setState({ radiusQuery: value });
  };

  render() {
    const intl = this.props.intl;

    return (
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
              <View hAlignContent="center" vAlignContent="center" grow={1}>
                <h2>
                  <FormattedMessage id="Search.loadingError" />
                </h2>
              </View>
            ),
            ({ restaurants }, loading) => (
              <View column hAlignContent="left" grow className="search">
                <View className="search-inputs" shrink={false} wrap vAlignContent="center">
                  <ConfirmationInput
                    placeholder={intl.formatMessage({ id: 'Search.searchLabel' })}
                    initialValue={this.state.searchInput}
                    onChange={this.onSearchChange}
                    onConfirm={this.onSearchConfirm}
                    onClear={this.onSearchClear}
                    text={{ clear: 'X', toConfirm: undefined }}
                    icon={{ clear: undefined, toConfirm: undefined }}
                  />
                  <View className="location">
                    <View column vAlignContent="center">
                      <h5>
                        <FormattedMessage id="Search.locationLabel" />
                      </h5>
                      <ConfirmationInput
                        placeholder={intl.formatMessage({ id: 'Search.locationLabel' })}
                        initialValue={this.state.locationInput}
                        onChange={this.onLocationChange}
                        onConfirm={this.onLocationConfirm}
                        onClear={this.onLocationClear}
                        text={{ clear: 'X', toConfirm: undefined }}
                        icon={{ clear: undefined, toConfirm: undefined }}
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
                <View className="list" grow wrap vAlignContent="top">
                  {restaurants.map(r => (
                    <View key={r.id} onClick={() => this.goToDetails(r.id)}>
                      <Panel className="business-card" type="floating" header={{ title: r.name }}>
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
    );
  }
}

export default injectIntl(Search);
