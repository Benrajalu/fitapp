There's a demo for this here: [https://fit-app-io.firebaseapp.com](https://fit-app-io.firebaseapp.com).


This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

So you may want to read more about [Create React App](https://github.com/facebookincubator/create-react-app), so go there first if you're so inclined.

## About this

This is a pet project that went on for a bit more than it should have. 

Essentialy it's a Single Page Application running on react.js for everything front-end, and [Firebase](https://firebase.google.com/) for everything back-end.

It features several coding patterns and conondrums that are meant to be at least as close to "real-world" as possible: 

- User sign up
- User Login
- Using login / signup through Facebook and / or Google 
- Agnostic Responsive webdesign
- Real-time database with API logic 
- User-created content
- Computer-assisted calculations 
- Shamefully forgotten `console.log()`instances 

## What is fit-app? 

*Fit app is a fitness log for gym-goers.* It enables them to create and manage routines, which are a succession of exercises customized in sets, reps and handicap (more or less weight, more or less minutes of effort). When working out, then can log this workout following along their created routine and reporting their results. 

*Fit App tries to be smart and offers ways to make users stronger / fitter / more miserable.* When users completed a workout, Fit App assesses which exercises from this workout have been completed whithin the parameters set by the user. If you've created a routine with Squats, 3 sets of 5 reps at 50kg, then reported all those sets as completed, then Fit App will suggest a heavier weight for the next time you're running that routine. 

*Fit app is customizable* to an extent. All gyms don't have the same free weights, all barbell bars don't weight the same, every user doesn't want their display name to be their email address etc... All of these are customizable, down to the very important profile picture. 

## Can I use Fit App? 

Sure, the app runs already at [https://fit-app-io.firebaseapp.com](https://fit-app-io.firebaseapp.com). You're free to create an account there and get to it. Some caveats though: 

- The app is written in English code-wise, but in French when it comes to UI
- The exercise names are all in English. I have no idea how to translate them yet. 
- The UI is v1. You may encounter some weird ergonomical issues that are maybe already part of my [issue backlog](https://github.com/Benrajalu/fitapp/issues). If they're not, you're free to make them know to me politely. 
- *You can't delete your account yet, I have not yet written that code.* This may be a big deal to you. 

_If you don't want to create an account for whatever reason but you're looking for a way to try the app nonetheless, you can use these credentials:_
*login:* test@test.com
*pass* foobar

## How can I make this run on my machine? 

This app runs on [Create React App](https://github.com/facebookincubator/create-react-app).

You should be able to get it working by coning this repo, then going all: 
- `npm install`
- `npm start`

And that's about it. 

## Are the tests working? 
Yes and no. 

Firebase isn't playing along very well with Jest as of now, so when you try to run `npm run test` you'll see it fail and crash fairly soon. However, if you run tests manually, you'll see that *all of the written tests are passing with flying colors*. Yes, I'm pulling a "not my fault" here. Sorry. 



