import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

class InlineLoader extends React.Component {
  render() {
    return (
      <div
        className={
          this.props.type ? 'inlineLoader ' + this.props.type : 'inlineLoader'
        }>
        {this.props.type && this.props.type === 'error' ? (
          <FontAwesomeIcon icon={['far', 'exclamation-triangle']} size="1x" />
        ) : (
          <div className="bits">
            <i />
            <i />
            <i />
            <i />
          </div>
        )}
        <p>{this.props.copy ? this.props.copy : 'Suppression en cours'}</p>
      </div>
    );
  }
}

export default InlineLoader;
