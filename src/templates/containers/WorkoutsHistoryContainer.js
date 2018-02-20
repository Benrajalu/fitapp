import { connect } from "react-redux";
import WorkoutsHistory from "../blocks/WorkoutsHistory.js";
import { triggerWorkoutWindow } from "../../actions/MenuActions";

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    routines: state.routines,
    workoutLogs: state.workoutLogs.list,
    exercisesDatabase: state.exercises.list,
    limit: ownProps.limit
  };
};

const mapDispatchToProps = dispatch => {
  return {
    triggerWorkoutWindow: () => {
      dispatch(triggerWorkoutWindow());
    }
  };
};

const WorkoutsHistoryContainer = connect(mapStateToProps, mapDispatchToProps)(
  WorkoutsHistory
);

export default WorkoutsHistoryContainer;
