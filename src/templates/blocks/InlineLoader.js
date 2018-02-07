import React from 'react';

class InlineLoader extends React.Component {
  render() {
    return (
      <div className="inlineLoader">
        <div className="bits">
          <i />
          <i />
          <i />
          <i />
        </div>
        <p>Suppression en cours</p>
      </div>
    );
  }
}

export default InlineLoader;
