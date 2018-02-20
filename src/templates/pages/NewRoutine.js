import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { watchRoutines } from '../../actions/RoutinesActions';
import { changeLayout } from '../../actions/MenuActions';

import RoutineMaker from '../blocks/RoutineMaker';

const mapStateToProps = state => {
  return {
    user: state.user,
    menu: state.menu,
    routines: state.routines,
    exercises: state.exercises
  };
};

const mapDispatchToProps = dispatch => {
  return {
    watchRoutines: () => {
      dispatch(watchRoutines());
    },
    changeLayout: layout => {
      dispatch(changeLayout(layout));
    }
  };
};

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
          <RoutineMaker
            postHandler={this.handleFormPost}
            user={this.props.user}
            exercises={this.props.exercises.list}
            menuState={this.props.menu}
            toggleMenu={this.props.changeLayout}
            watchRoutines={this.props.watchRoutines}
          />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewRoutine);
