import { connect } from 'react-redux'
import RecordsHistory from "../blocks/RecordsHistory.js"

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user, 
    records: state.workoutLogs.records,
    exercisesDatabase: state.exercises.list,
    limit: ownProps.limit
  }
}


const WorkoutsHistoryContainer = connect(
  mapStateToProps,
)(RecordsHistory)

export default WorkoutsHistoryContainer