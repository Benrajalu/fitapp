import React, { Component } from 'react';
import { connect } from 'react-redux';
import { watchRoutines } from '../../actions/RoutinesActions';
import { changeLayout } from '../../actions/MenuActions';
import { Link } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import InlineLoader from '../blocks/InlineLoader';

import RoutineMaker from '../blocks/RoutineMaker';

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    menu: state.menu,
    routines: state.routines,
    exercises: state.exercises,
    match: ownProps.match
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

class EditRoutine extends Component {
  constructor(props) {
    super(props);
    this.handeleFormPost = this.handleFormPost.bind(this);
    this.getRoutine = this.getRoutine.bind(this);
    this.state = {
      user: this.props.user,
      routine: false,
      loading: true,
      mounted: false
    };
  }

  getRoutine(data) {
    const routineId = data.match.params.id;

    var realRoutine = data.routines.routines.filter(
      obj => obj.routineId === parseFloat(routineId)
    );

    if (realRoutine.length > 0) {
      this.setState({
        routine: realRoutine[0],
        loading: false,
        error: false
      });
    } else {
      this.setState({
        routine: false,
        loading: false,
        error: true
      });
    }
  }

  componentDidMount() {
    document.title = "FitApp. - Modification d'un programme";
    const _this = this;
    setTimeout(() => {
      _this.setState({
        mounted: true
      });
    }, 200);
    this.getRoutine(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getRoutine(nextProps);
  }

  handleFormPost(event, data) {
    event.preventDefault();
  }

  render() {
    return (
      <div
        className={
          this.state.mounted
            ? 'EditRoutine page-animations loaded'
            : 'EditRoutine page-animations'
        }>
        <div className="container-fluid page-intro intro-animation">
          <div className="container">
            <Link to="/">
              <FontAwesomeIcon icon={['fas', 'angle-left']} size="1x" /> Retour
            </Link>
            <h1 className="page-header">Modifier une routine</h1>
          </div>
        </div>
        <div className="container">
          {this.state.routine ? (
            <RoutineMaker
              postHandler={this.handleFormPost}
              user={this.props.user}
              exercises={this.props.exercises.list}
              menuState={this.props.menu}
              toggleMenu={this.props.changeLayout}
              watchRoutines={this.props.watchRoutines}
              editRoutine={this.state.routine ? this.state.routine : 'empty'}
            />
          ) : null}
          {this.state.loading ? (
            <div className="container empty">
              <InlineLoader copy="Chargement de la routine" />
            </div>
          ) : null}
          {this.state.error ? (
            <div className="container empty">
              <InlineLoader copy="Cette routine n'existe pas" type="error" />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditRoutine);
