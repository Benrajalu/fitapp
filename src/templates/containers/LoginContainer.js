import { connect } from 'react-redux'
import {getLoading, removeLoading} from '../../actions/';
import Login from "../pages/Login.js"

const mapStateToProps = (state, ownProps) => {
  return {
    firebase: state.firebase,
    user: state.user, 
    loading:state.loading
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getLoading: () => {
      dispatch(getLoading())
    },
    removeLoading: () => {
      dispatch(removeLoading())
    }
  }
}

const LoginContainer = connect(
  mapStateToProps, 
  mapDispatchToProps
)(Login)

export default LoginContainer