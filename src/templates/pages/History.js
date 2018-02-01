import React, { Component } from 'react';

import WorkoutsHistoryContainer from '../containers/WorkoutsHistoryContainer';
import RecordsHistoryContainer from '../containers/RecordsHistoryContainer';

class History extends Component {
  constructor(props) {
    super(props);
    this.state={
      mounted:false
    }
    /*this.displayModal = this.displayModal.bind(this);*/
  }

  componentDidMount(){
    document.title = "FitApp. - Historique de vos entraînements";
    const _this = this;
    setTimeout(() => {
      _this.setState({
        mounted:true
      });
    }, 200)
  }


  render() {
    return (
      <div className={this.state.mounted ? "History loaded" : "History"}>
        <p className="mainLogo">fit<strong>app</strong></p>
        <div className="container">
          <h1 className="page-header">Historique</h1>
        </div>

        <div className="container">
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
    )
  }
}

export default History;
