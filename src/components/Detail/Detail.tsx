import * as React from 'react';
import View from '../Basic/View';
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { WithQueries } from 'avenger/lib/react';
import { LoadingSpinner, Panel, Badge } from '../Basic';
import { business, reviews } from '../../queries/queries';
import { formatDay } from '../../util/localization';
import { Business, Review, Day } from '../../model';

import './detail.scss';

type Props = {
  businessId: string;
} & InjectedIntlProps;

class Detail extends React.Component<Props> {
  hours = (business: Business): JSX.Element => {
    const intl = this.props.intl;
    return business.hours.fold(<FormattedMessage id="Business.noHours" />, someHours => (
      <View column>
        <h4>
          <FormattedMessage id="Business.hours" />
        </h4>
        <View>
          {someHours.map((h, index) => (
            <View column key={index}>
              <Badge
                label={
                  h.is_open_now
                    ? intl.formatMessage({ id: 'Business.open' })
                    : intl.formatMessage({ id: 'Business.closed' })
                }
              />
              <ul>
                {h.open.map((hv, index) => (
                  <li key={index}>
                    <FormattedMessage
                      id="Business.hour"
                      values={{
                        day: formatDay(intl, hv.day as Day),
                        from: intl.formatTime(
                          new Date(`01/01/1970 ${hv.start.slice(0, 2)}:${hv.start.slice(2)}`)
                        ),
                        to: intl.formatTime(
                          new Date(`01/01/1970 ${hv.end.slice(0, 2)}:${hv.end.slice(2)}`)
                        )
                      }}
                    />
                  </li>
                ))}
              </ul>
            </View>
          ))}
        </View>
      </View>
    ));
  };

  reviews = (reviews: Array<Review>): JSX.Element => {
    const intl = this.props.intl;
    return (
      <View column>
        <h4>
          <FormattedMessage id="Business.reviews" />
        </h4>
        <View column className="review-list">
          {reviews.map(r => (
            <Panel key={r.id} type="floating" header={{ title: r.user.name }}>
              <View column className="review-content">
                <FormattedMessage
                  id="Business.review.info"
                  values={{
                    rating: r.rating,
                    created: intl.formatDate(r.time_created)
                  }}
                />
                <View>{r.text}</View>
              </View>
            </Panel>
          ))}
        </View>
      </View>
    );
  };

  render() {
    const intl = this.props.intl;

    return (
      <WithQueries
        queries={{ business, reviews }}
        params={{
          business: this.props.businessId,
          reviews: this.props.businessId
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
                  <FormattedMessage id="Business.loadingError" />
                </h2>
              </View>
            ),
            ({ business, reviews }) => {
              return (
                <Panel className="detail" type="floating" header={{ title: business.name }}>
                  <View column grow>
                    <View shrink={false}>
                      <img src={`${business.image_url}`} />
                      <View className="review" column vAlignContent="top">
                        <h4>
                          <FormattedMessage id="Business.categories" />
                        </h4>
                        <View wrap>
                          {business.categories.map(c => (
                            <Badge key={c.alias} label={c.title} />
                          ))}
                        </View>
                        <h4>
                          <FormattedMessage id="Business.info" />
                        </h4>
                        <FormattedMessage
                          id="Business.price"
                          values={{ price: business.price.getOrElse('') }}
                        />
                        <FormattedMessage
                          id="Business.rating"
                          values={{ rating: business.rating }}
                        />
                        <FormattedMessage
                          id="Business.review"
                          values={{ review: business.review_count }}
                        />
                        <FormattedMessage
                          id="Business.address"
                          values={{ address: business.location.display_address.join(' ') }}
                        />
                        <FormattedMessage
                          id="Business.phone"
                          values={{ phone: business.display_phone }}
                        />
                      </View>
                    </View>
                    <View className="hours-reviews" wrap>
                      {this.hours(business)}
                      {this.reviews(reviews)}
                    </View>
                  </View>
                </Panel>
              );
            }
          )
        }
      />
    );
  }
}

export default injectIntl(Detail);
