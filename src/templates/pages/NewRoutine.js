import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import RoutineMaker from '../blocks/RoutineMaker';

class NewRoutine extends Component {
  constructor(props) {
    super(props);
    this.handleFormPost = this.handleFormPost.bind(this);
    this.state = {
      mounted: false
    };
  }

  handleFormPost(event, data) {
    event.preventDefault();
  }

  componentDidMount() {
    document.title = "FitApp. - Création d'un programme d'entraînement";
    const _this = this;
    setTimeout(() => {
      _this.setState({
        mounted: true
      });
    }, 200);
  }

  render() {
    return (
      <div className={this.state.mounted ? 'NewRoutine loaded' : 'NewRoutine'}>
        <div className="container-fluid page-intro">
          <div className="container">
            <Link to="/">
              <FontAwesomeIcon icon={['fas', 'angle-left']} size="1x" /> Retour
            </Link>
            <h1 className="page-header">Nouvelle routine</h1>
          </div>
        </div>

        <div className="container animation-contents">
          <RoutineMaker postHandler={this.handleFormPost} />
        </div>
      </div>
    );
  }
}

export default NewRoutine;
