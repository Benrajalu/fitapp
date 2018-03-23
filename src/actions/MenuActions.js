// menu actions
export const openMenu = () => ({
    type: 'OPEN_MENU', 
    status: "opened"
});

export const closeMenu = () => ({
    type: 'CLOSE_MENU', 
    status: "closed"
});

export const openWorkouts = () => ({
    type: 'OPEN_WORKOUTS', 
    workouts: "opened"
});

export const closeWorkouts = () => ({
    type: 'CLOSE_WORKOUTS', 
    workouts: "closed"
});

export const changeLayout = (format) => ({
    type: 'CHANGE_MENU_LAYOUT', 
    layout: format
});

export function triggerWorkoutWindow() {
  // Redux Thunk will inject dispatch here:
  return (dispatch, getState) => {
    const menuStatus = getState().menu.status, 
          workoutStatus = getState().menu.workouts;
    if (menuStatus === "opened" && workoutStatus === "opened"){
      dispatch(closeMenu());
      dispatch(closeWorkouts());
    }
    else if (menuStatus === "opened"){
      dispatch(closeMenu());
      dispatch(openWorkouts());
    }
    else if(workoutStatus === "opened"){
      dispatch(closeWorkouts());
    }
    else{
      dispatch(openWorkouts());
    }
  }
}

export function toggleMenu() {
  // Redux Thunk will inject dispatch here:
  return (dispatch, getState) => {
    const menuStatus = getState().menu.status;

    if (menuStatus === "opened"){
      dispatch(closeMenu());
    }
    else{
      dispatch(openMenu());
    }
  }
}