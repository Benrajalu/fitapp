import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from "moment";
import 'moment/locale/fr';

class Timestamper extends Component {
  render() {
    return (
      <p>{moment(this.props.timestamp).calendar()}</p>
    )
  }
}

Timestamper.propTypes = {
  timestamp: PropTypes.number.isRequired
}

export default Timestamper;
