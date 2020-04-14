import * as React from 'react';
import View from '../Basic/View';
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { WithQueries } from 'avenger/lib/react';
import { LoadingSpinner, Panel, Badge } from '../Basic';
import { businessWithReviews } from '../../queries/queries';
import { formatDay } from '../../util/localization';
import { Day, Business, Review } from 'src/model';

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
            <View key={index} column>
              <Badge
                label={
                  h.is_open_now
                    ? intl.formatMessage({ id: 'Business.open' })
                    : intl.formatMessage({ id: 'Business.closed' })
                }
              />
              <ul>
                {h.open.map(hv => (
                  <li key={hv.day}>
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

  reviews = (reviews: Array<Review>): JSX.Element => (
    <View column>
      <h4>
        <FormattedMessage id="Business.reviews" />
      </h4>
      <View>
        {reviews.map(r => (
          <Panel key={r.id} type="floating" header={{ title: r.user.name }}>
            <View column>
              <FormattedMessage id="Business.review.info" />
              <p>{r.text}</p>
            </View>
          </Panel>
        ))}
      </View>
    </View>
  );

  render() {
    const intl = this.props.intl;

    return (
      <WithQueries
        queries={{ businessWithReviews }}
        params={{
          businessWithReviews: { business: this.props.businessId, reviews: this.props.businessId }
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
            ({ businessWithReviews }) => {
              const business = businessWithReviews.business;
              const reviews = businessWithReviews.reviews;

              return (
                <Panel className="detail" type="floating" header={{ title: business.name }}>
                  <View column>
                    <View>
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
                    <View>
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
