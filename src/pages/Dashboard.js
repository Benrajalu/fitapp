import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Dashboard extends Component {
  render() {
    return (
      <div className="Dashboard">
        <div className="container">
          <div className="page-header">
            <h1>Dashboard</h1>
          </div>
        </div>

        <div className="container">
          <div className="col-md-4">
            <button className="btn btn-primary btn-lg btn-block">Lancer un entraînement</button>
          </div>
          <div className="col-md-4">
            <Link to='/new-routine' className="btn btn-default btn-lg btn-block">Créer un entraînement</Link>
          </div>
          <div className="col-md-4">
            <Link to='/settings' className="btn btn-default btn-lg btn-block">Paramètres</Link>
          </div>
        </div>
      </div>
    )
  }
}

export default Dashboard;
