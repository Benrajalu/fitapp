import { connect } from 'react-redux'
import {openMenu, closeMenu, openWorkouts, closeWorkouts, changeLayout, triggerWorkoutWindow, toggleMenu} from '../../actions/MenuActions';
import {resetUser} from '../../actions/UserActions';
import Nav from "../blocks/Nav.js"

const mapStateToProps = (state, ownProps) => {
  return {
    firebase: state.firebase,
    user: state.user, 
    loading:state.loading, 
    menu:state.menu, 
    routines: state.routines, 
    exercises: state.exercises
  }
}

const mapDispatchToProps = dispatch => {
  return {
    openMenu: () => {
      dispatch(openMenu())
    },
    closeMenu: () => {
      dispatch(closeMenu())
    },
    openWorkouts: () => {
      dispatch(openWorkouts())
    },
    closeWorkouts: () => {
      dispatch(closeWorkouts())
    },
    changeLayout: () => {
      dispatch(changeLayout())
    },
    triggerWorkoutWindow: () => {
      dispatch(triggerWorkoutWindow())
    }, 
    toggleMenu: () => {
      dispatch(toggleMenu())
    }, 
    resetUser:()=>{
      dispatch(resetUser());
    }
  }
}

const MenuContainer = connect(
  mapStateToProps, 
  mapDispatchToProps, 
  null, 
  {pure : false}
)(Nav)

export default MenuContainer