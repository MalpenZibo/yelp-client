import * as React from 'react';
import { doUpdateCurrentView } from '../../commands';
import { WithQueries } from 'avenger/lib/react';
import { restaurants } from '../../queries/queries';
import { Panel, LoadingSpinner, View, SingleDropdown, Input } from '../Basic';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import _ = require('lodash');
import { Option, some } from 'fp-ts/lib/Option';

import './search.scss';

type Props = {
  term: Option<string>;
  location: Option<string>;
  radius: Option<number>;
  setFilter: (value: {
    term: Option<string>;
    location: Option<string>;
    radius: Option<number>;
  }) => void;
} & InjectedIntlProps;

type State = {
  termQuery: string;
  termInput: string;
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

class Search extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.onTermConfirm = _.debounce(this.onTermConfirm, 500);
    this.onLocationConfirm = _.debounce(this.onLocationConfirm, 500);
  }
  state = {
    termQuery: this.props.term.getOrElse(''),
    termInput: this.props.term.getOrElse(''),
    locationQuery: this.props.location.getOrElse(defaultLocation),
    locationInput: this.props.location.getOrElse(defaultLocation),
    radiusQuery: radiusOptions
      .findFirst(ro => ro.value == this.props.radius.getOrElse(radiusOptions.head.value))
      .getOrElse(radiusOptions.head)
  };

  goToDetails = (id: string) => {
    doUpdateCurrentView({ view: 'detail', businessId: id }).run();
  };

  onTermChange = (value: string) => {
    this.setState({ termInput: value });

    this.onTermConfirm(value);
  };

  onTermConfirm = (value: string) => {
    this.setState({ termQuery: value });

    this.props.setFilter({
      term: some(value),
      location: some(this.state.locationQuery),
      radius: some(this.state.radiusQuery.value)
    });
  };

  onLocationChange = (value: string) => {
    this.setState({ locationInput: value });
    if (value.length > 0) {
      this.onLocationConfirm(value);
    }
  };

  onLocationConfirm = (value: string) => {
    this.setState({ locationQuery: value });

    this.props.setFilter({
      term: some(this.state.termQuery),
      location: some(value),
      radius: some(this.state.radiusQuery.value)
    });
  };

  onRadiusChange = (value: { value: number; label: string }) => {
    this.setState({ radiusQuery: value });

    this.props.setFilter({
      term: some(this.state.termQuery),
      location: some(this.state.locationQuery),
      radius: some(value.value)
    });
  };

  render() {
    const intl = this.props.intl;

    return (
      <View column hAlignContent="left" grow className="search">
        <View className="search-inputs" shrink={false} wrap vAlignContent="center">
          <Input
            placeholder={intl.formatMessage({ id: 'Search.termLabel' })}
            value={this.state.termInput}
            onChange={this.onTermChange}
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
              searchQuery: this.state.termQuery,
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
                                <FormattedMessage
                                  id="Search.Rating"
                                  values={{ rating: r.rating }}
                                />
                                <FormattedMessage
                                  id="Search.Review"
                                  values={{ review: r.review_count }}
                                />
                              </View>
                            </View>
                            <View column>
                              <FormattedMessage
                                id="Search.Address"
                                values={{ address: r.location.display_address.join(' ') }}
                              />
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
