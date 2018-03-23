import React, { Component } from 'react';

import WorkoutsHistoryContainer from '../containers/WorkoutsHistoryContainer';
import RecordsHistoryContainer from '../containers/RecordsHistoryContainer';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
    /*this.displayModal = this.displayModal.bind(this);*/
  }

  componentDidMount() {
    document.title = 'FitApp. - Historique de vos entraînements';
    const _this = this;
    setTimeout(() => {
      _this.setState({
        mounted: true
      });
    }, 200);
  }

  render() {
    return (
      <div
        className={
          this.state.mounted
            ? 'History page-animations loaded'
            : 'History page-animations'
        }>
        <div className="container-fluid page-intro intro-animation">
          <div className="container">
            <Link to="/">
              <FontAwesomeIcon icon={['fas', 'angle-left']} size="1x" /> Retour
            </Link>
            <h1 className="page-header">Historique</h1>
          </div>
        </div>

        <div className="container intro-animation">
          <div className="large-9 medium-8 columns workout-logs">
            <p className="records-title">Vos entraînements</p>
            <WorkoutsHistoryContainer />
          </div>
          <div className="large-3 medium-4 columns records-logs">
            <p className="records-title">Vos records</p>
            <RecordsHistoryContainer />
          </div>
        </div>
      </div>
    );
  }
}

export default History;
