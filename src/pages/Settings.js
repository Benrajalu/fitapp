import React, { Component } from 'react';

import userData from '../data/users.json';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: {
        baseBarbell: 0, 
        availableWeights: []
      }
    }
  }

  componentDidMount() {
    this.setState({
      settings: userData[0].settings
    })
  }

  render() {
    return (
      <div className="Settings">
        <div className="container">
          <div className="page-header">
            <h1>Paramètres</h1>
          </div>
        </div>

        <div className="container">
          <div className="col-md-8">
            <h3>Gestion des poids (barbell)</h3>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Poids de la barre à vide</h3>
              </div>
              <form action="#" className="panel-body">
                <input type="number" value={this.state.settings.baseBarbell} /> kg
              </form>
            </div>

            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Poids libres disponibles</h3>
              </div>
              <form action="#" className="panel-body">
                <div><input type="checkbox" name="availableWeights" value="25" checked={this.state.settings.availableWeights.indexOf(25) > -1 ? true : false} /> 25kg</div>
                <div><input type="checkbox" name="availableWeights" value="20" checked={this.state.settings.availableWeights.indexOf(20) > -1 ? true : false} /> 20kg</div>
                <div><input type="checkbox" name="availableWeights" value="15" checked={this.state.settings.availableWeights.indexOf(15) > -1 ? true : false} /> 15kg</div>
                <div><input type="checkbox" name="availableWeights" value="10" checked={this.state.settings.availableWeights.indexOf(10) > -1 ? true : false} /> 10kg</div>
                <div><input type="checkbox" name="availableWeights" value="5" checked={this.state.settings.availableWeights.indexOf(5) > -1 ? true : false} /> 5kg</div>
                <div><input type="checkbox" name="availableWeights" value="2.5" checked={this.state.settings.availableWeights.indexOf(2.5) > -1 ? true : false} /> 2.5kg</div>
                <div><input type="checkbox" name="availableWeights" value="1.25" checked={this.state.settings.availableWeights.indexOf(1.25) > -1 ? true : false} /> 1.25kg</div>
                <div><input type="checkbox" name="availableWeights" value="1" checked={this.state.settings.availableWeights.indexOf(1) > -1 ? true : false} /> 1kg</div>
                <div><input type="checkbox" name="availableWeights" value="0.5" checked={this.state.settings.availableWeights.indexOf(0.5) > -1 ? true : false} /> 0.5kg</div>
                <div><input type="checkbox" name="availableWeights" value="0.25" checked={this.state.settings.availableWeights.indexOf(0.25) > -1 ? true : false} /> 0.25kg</div>
              </form>
            </div>
          </div>

          <div className="col-md-4">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Paramètres du compte</h3>
              </div>
              <div className="panel-body">
                Here will be account stuff
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Settings;
