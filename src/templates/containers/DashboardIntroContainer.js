import { connect } from 'react-redux'
import Intro from "../blocks/Dashboard/Intro.js"

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user
  }
}


const DashboardIntroContainer = connect(
  mapStateToProps, 
)(Intro)

export default DashboardIntroContainer