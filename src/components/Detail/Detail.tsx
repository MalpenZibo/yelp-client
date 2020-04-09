import * as React from 'react';
import View from '../Basic/View';
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { WithQueries } from 'avenger/lib/react';
import { LoadingSpinner, Panel, Badge } from '../Basic';
import { business } from '../../queries/queries';
import { formatDay } from '../../util/localization';
import { Day, Business } from 'src/model';

import './detail.scss';

type Props = {
  businessId: string;
} & InjectedIntlProps;

class Detail extends React.Component<Props> {
  hours = (business: Business): JSX.Element => {
    const intl = this.props.intl;
    return business.hours.fold(<FormattedMessage id="Business.NoHours" />, someHours => (
      <View column>
        <h4>
          <FormattedMessage id="Business.Hours" />
        </h4>
        <View>
          {someHours.map((h, index) => (
            <View key={index} column>
              <Badge
                label={
                  h.is_open_now
                    ? intl.formatMessage({ id: 'Business.Open' })
                    : intl.formatMessage({ id: 'Business.Closed' })
                }
              />
              <ul>
                {h.open.map(hv => (
                  <li key={hv.day}>
                    <FormattedMessage
                      id="Business.Hour"
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

  render() {
    const intl = this.props.intl;

    return (
      <WithQueries
        queries={{ business }}
        params={{ business: { businessId: this.props.businessId } }}
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
            ({ business }) => (
              <Panel className="detail" type="floating" header={{ title: business.name }}>
                <View column>
                  <View>
                    <img src={`${business.image_url}`} />
                    <View className="review" column vAlignContent="top">
                      <h4>
                        <FormattedMessage id="Business.Categories" />
                      </h4>
                      <View wrap>
                        {business.categories.map(c => (
                          <Badge key={c.alias} label={c.title} />
                        ))}
                      </View>
                      <h4>
                        <FormattedMessage id="Business.Info" />
                      </h4>
                      <FormattedMessage id="Business.Price" values={{ price: business.price }} />
                      <FormattedMessage id="Business.Rating" values={{ rating: business.rating }} />
                      <FormattedMessage
                        id="Business.Review"
                        values={{ review: business.review_count }}
                      />
                      <FormattedMessage
                        id="Business.Address"
                        values={{ address: business.location.display_address.join(' ') }}
                      />
                      <FormattedMessage
                        id="Business.Phone"
                        values={{ phone: business.display_phone }}
                      />
                    </View>
                  </View>
                  {this.hours(business)}
                </View>
              </Panel>
            )
          )
        }
      />
    );
  }
}

export default injectIntl(Detail);
