import React, { Component } from 'react';
import { connect } from 'react-redux';

import { watchRoutines } from '../../actions/RoutinesActions';
import { toggleModal } from '../../actions/ModalActions';
import { removeUser, resetUser } from '../../actions/UserActions';
import { watchLogs, watchRecords } from '../../actions/WorkoutLogActions';

// Modal imports
import RoutineDelete from '../blocks/Modals/RoutineDelete';
import AccountDeleteModal from '../blocks/Modals/AccountDeleteModal';
import WeightHelperModal from '../blocks/Modals/WeightHelperModal';
import WorkoutExit from '../blocks/Modals/WorkoutExit';

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    menu: state.menu,
    modals: state.modals,
    routines: state.routines,
    exercises: state.exercises,
    workoutLogs: state.workoutLogs
  };
};

const mapDispatchToProps = dispatch => {
  return {
    watchRoutines: () => {
      dispatch(watchRoutines());
    },
    removeUser: () => {
      dispatch(removeUser());
    },
    resetUser: () => {
      dispatch(resetUser());
    },
    toggleModal: data => {
      dispatch(toggleModal(data));
    },
    watchLogs: () => {
      dispatch(watchLogs());
    },
    watchRecords: () => {
      dispatch(watchRecords());
    }
  };
};

class ModalFactory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  render() {
    var modalToDisplay = null;
    switch (this.props.modals.data.type) {
      case 'delete':
        modalToDisplay = (
          <RoutineDelete
            shouldAppear={'visible'}
            target={this.props.modals.data.id}
            routines={this.props.routines.routines}
            closeModal={this.props.toggleModal}
            refresh={this.props.watchRoutines}
            user={this.props.user}
          />
        );
        break;

      case 'account':
        modalToDisplay = (
          <AccountDeleteModal
            closeModal={this.props.toggleModal}
            user={this.props.user}
            resetUser={this.props.resetUser}
            removeUser={this.props.removeUser}
          />
        );
        break;

      case 'warmup':
        modalToDisplay = (
          <WeightHelperModal
            closeModal={this.props.toggleModal}
            targetWindow="warmup"
            name={this.props.modals.data.name}
            weight={parseFloat(this.props.modals.data.handicap)}
            maxReps={parseFloat(this.props.modals.data.repTarget)}
            type={this.props.modals.data.exoType}
            settings={this.props.user.settings}
          />
        );
        break;

      case 'loadout':
        modalToDisplay = (
          <WeightHelperModal
            closeModal={this.props.toggleModal}
            targetWindow="loadout"
            name={this.props.modals.data.name}
            weight={parseFloat(this.props.modals.data.handicap)}
            maxReps={parseFloat(this.props.modals.data.repTarget)}
            type={this.props.modals.data.exoType}
            settings={this.props.user.settings}
          />
        );
        break;

      case 'endWorkout':
        modalToDisplay = (
          <WorkoutExit
            closeModal={this.props.toggleModal}
            changedRoutine={this.props.modals.data.changedRoutine}
            currentRoutine={this.props.modals.data.currentRoutine}
            originalRoutine={this.props.modals.data.originalRoutine}
            exercisesDatabase={this.props.exercises.list}
            workoutLogs={this.props.workoutLogs.list}
            records={this.props.workoutLogs.records}
            user={this.props.user}
            watchLogs={this.props.watchLogs}
            watchRecords={this.props.watchRecords}
            watchRoutines={this.props.watchRoutines}
          />
        );
        break;
      default:
        modalToDisplay = null;
    }
    return modalToDisplay;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalFactory);
