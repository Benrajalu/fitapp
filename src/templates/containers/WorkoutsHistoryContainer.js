import { connect } from 'react-redux'
import WorkoutsHistory from "../blocks/WorkoutsHistory.js"

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user, 
    routines: state.routines, 
    workoutLogs: state.workoutLogs.list,
    exercisesDatabase: state.exercises.list,
    limit: ownProps.limit
  }
}


const WorkoutsHistoryContainer = connect(
  mapStateToProps,
)(WorkoutsHistory)

export default WorkoutsHistoryContainer