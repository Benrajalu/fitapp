import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import {shallow, mount} from 'enzyme';
import Workout from '../pages/Workout';
import PropTypes from 'prop-types';

import userData from '../data/users.json';
import exercisesDatabase from '../data/exercises.json';

it('renders without crashing', () => {
  const MountOptions = {
      context: {
        router: {
          history: {
            createHref: (a, b) => {
            },
            push: () => {
            },
            replace: () => {
            }, 
            block: ()=> {
            }
          }
        }
      }, childContextTypes: {
        router: PropTypes.object
      }
  };
  const match = {
    params:{
      id: "01routineA"
    }
  };
  const dash = mount(
    <Workout match={match} />, 
    MountOptions
  );

  dash.setState({
    routineId: '01routineA', 
    user: {
      contactEmail:userData[0].contactEmail,
      displayName:userData[0].displayName,
      profilePicture:userData[0].profilePicture,
      signinEmail:userData[0].signinEmail,
      uid: "0",
      settings:{
        availableWeights:[20, 10, 5, 2.5, 1.25, 0.5, 0.25],
        baseBarbell:10
      }
    },
    exercisesDatabase: exercisesDatabase, 
    routine: userData[0].routines.filter(obj => obj.id === '01routineA' )[0],
    workoutLog:{
      exercises:[
        {
          exerciseId:"ex-11",
          handicap:10,
          repTarget:1,
          sets:[0],
          setsTarget:1
        }
      ]
    }
  })
});

test('displays the correct routine', () => {
  const MountOptions = {
      context: {
        router: {
          history: {
            createHref: (a, b) => {
            },
            push: () => {
            },
            replace: () => {
            }, 
            block: ()=> {
            }
          }
        }
      }, childContextTypes: {
        router: PropTypes.object
      }
  };
  const match = {
    params:{
      id: "01routineA"
    }
  };
  const dash = mount(
    <Workout match={match} />, 
    MountOptions
  );

  const today = new Date(), 
        cleanRoutine = userData[0].routines.filter(obj => obj.id === "01routineA" )[0];
  
  // Setting up a mock version of the workout log (for history) of the current exercises...
  let logExercises = [];
  // ...then mapping the routine's infos into it
  cleanRoutine.exercises.map((value) => 
    logExercises.push({
      exerciseId: value.exerciseId, 
      repTarget: value.reps ? value.reps : false,
      setsTarget: value.sets ? value.sets : false,
      handicap: value.handicap ? value.handicap : 0
    })
  );

  dash.setState({
    user: userData[0],
    exercisesDatabase: exercisesDatabase, 
    routine: cleanRoutine, 
    workoutLog:{
      "id": "log-" + today.getTime(), 
      "routineName": userData[0].routines.filter(obj => obj.id === "01routineA" )[0].name, 
      "timestamp": today.getTime(), 
      "exercises": logExercises
    }
  });
  
  // Expecting message not to be empty
  expect(dash.find('h1 small').text()).toEqual('Routine A');
});

describe('when exiting a workout', () => {
  const MountOptions = {
      context: {
        router: {
          history: {
            createHref: (a, b) => {
            },
            push: () => {
            },
            replace: () => {
            }, 
            block: ()=> {
            }
          }
        }
      }, childContextTypes: {
        router: PropTypes.object
      }
  };
  const match = {
    params:{
      id: "01routineA"
    }
  };
  const workout = mount(
    <Workout match={match} />, 
    MountOptions
  ); 

  workout.setState({
    routineId: '01routineA', 
    user: {
      contactEmail:userData[0].contactEmail,
      displayName:userData[0].displayName,
      profilePicture:userData[0].profilePicture,
      signinEmail:userData[0].signinEmail,
      uid: "0",
      settings:{
        availableWeights:[20, 10, 5, 2.5, 1.25, 0.5, 0.25],
        baseBarbell:10
      }
    },
    exercisesDatabase: exercisesDatabase, 
    routine: userData[0].routines.filter(obj => obj.id === '01routineA' )[0],
    workoutLog:{
      exercises:[
        {
          exerciseId:"ex-11",
          handicap:10,
          repTarget:1,
          sets:[0],
          setsTarget:1
        }
      ]
    }
  }) 

  test('the exit window apears when the exit button is clicked', () => {
    workout.find('.end-workout').first().simulate('click');
    expect(workout.find('.popin.visible .panel-title').first().text()).toEqual("Terminer l'entraînement ?");
  });

  test('if some exercise has changed, a prompt to save changes is shown', () => {
    workout.setState({
      changedRoutine:true
    });
    workout.find('.end-workout').first().simulate('click');
    expect(workout.find('.popin.visible label').first().text()).toEqual("Enregistrer les modifications");
  });

  test('if an exercise as all sets completed, a prompt to upgrade it is shown and calculates increment', () => {
    workout.setState({
      workoutLog:{
        id:"log-1506417813191",
        routineName:"Routine B",
        timestamp:1506417813191,
        exercises:[
          {exerciseId: "ex-04", repTarget: "10", setsTarget: "5", handicap: "20", sets: [10,10,10,10,10]},
          {exerciseId: "ex-06", repTarget: "5", setsTarget: "8", handicap: "15", sets: [0,0,0,0,0,0,0,0]}
        ]
      }
    });
    workout.find('.end-workout').first().simulate('click');
    expect(workout.find('.popin.visible .alert').first().text()).toEqual("Bent-over Rows peut passer de 20kg à 25kgNope!");
  });
});