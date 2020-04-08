import * as React from 'react';
import View from '../Basic/View';
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { WithQueries } from 'avenger/lib/react';
import { LoadingSpinner, Panel, Badge } from '../Basic';
import { business } from '../../queries/queries';

import './detail.scss';

type Props = {
  businessId: string;
} & InjectedIntlProps;

class Detail extends React.Component<Props> {
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
                  <FormattedMessage id="Search.loadingError" />
                </h2>
              </View>
            ),
            ({ business }) => (
              <Panel className="detail" type="floating" header={{ title: business.name }}>
                <View column>
                  <View>
                    <img src={`${business.image_url}`} />
                    <View className="review" column vAlignContent="top">
                      <h4>{intl.formatMessage({ id: 'Business.Categories' })}</h4>
                      <View>
                        {business.categories.map(c => (
                          <Badge label={c.title} />
                        ))}
                      </View>
                      <p>
                        {[intl.formatMessage({ id: 'Business.Price' }), business.price].join(': ')}
                      </p>
                      <p>
                        {[intl.formatMessage({ id: 'Business.Rating' }), business.rating].join(
                          ': '
                        )}
                      </p>
                      <p>
                        {[
                          intl.formatMessage({ id: 'Business.Review' }),
                          business.review_count
                        ].join(': ')}
                      </p>
                    </View>
                  </View>
                  <View column>
                    <p>
                      {[
                        intl.formatMessage({ id: 'Business.Address' }),
                        business.location.display_address.join(' ')
                      ].join(': ')}
                    </p>
                    <p>
                      {[intl.formatMessage({ id: 'Business.Phone' }), business.display_phone].join(
                        ': '
                      )}
                    </p>
                  </View>
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
