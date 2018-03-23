import { connect } from 'react-redux'
import {watchLogs} from '../../actions/WorkoutLogActions';
import WeeklyCounter from "../blocks/WeeklyCounter.js"

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user, 
    routines: state.routines, 
    workoutLogs: state.workoutLogs
  }
}

const mapDispatchToProps = dispatch => {
  return {
    watchLogs: () => {
      dispatch(watchLogs())
    }
  }
}


const WeeklyCounterContainer = connect(
  mapStateToProps, 
  mapDispatchToProps
)(WeeklyCounter)

export default WeeklyCounterContainer