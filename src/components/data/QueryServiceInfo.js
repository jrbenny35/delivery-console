import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { fetchServiceInfo } from 'console/state/serviceInfo/actions';

@connect(
  null,
  {
    fetchServiceInfo,
  },
)
class QueryServiceInfo extends React.PureComponent {
  static propTypes = {
    fetchServiceInfo: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.fetchServiceInfo();
  }

  render() {
    return null;
  }
}

export default QueryServiceInfo;
