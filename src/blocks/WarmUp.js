import React, { Component } from 'react';
import PropTypes from 'prop-types';

class WarmUp extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);

  }
  closeModal() {
    // References the parent method for displaying a modal that's in Dashboard.js
    this.props.closeModal();
  }

  render() {
    const repCeil = this.props.maxReps, 
          handicap = this.props.weight, 
          isBarebell = this.props.type === "barbell" ? true : false;

    // Check if the handicap is above the base barbell weight. If it's not, then all séries of the warmup are basically empty barbells
    let lowHandicap = false;
    if(isBarebell){
      lowHandicap = parseInt(handicap, 10) <= parseInt(this.props.settings.baseBarbell, 10) ? true : false;
    }
    
    let slides = [];

    // Slide 1, 2
    slides.push(
      <div className="slide">
        <p>{repCeil} x {isBarebell ? this.props.settings.baseBarbell + 'kg' : '5kg' }</p>
      </div>
    );
    slides.push(
      <div className="slide">
        <p>{repCeil} x {isBarebell ? this.props.settings.baseBarbell + 'kg' : '5kg' }</p>
      </div>
    );

    // Slides 3 to 5
    if(isBarebell && lowHandicap){
      let x = 3;
      for(x; x < 6; x++){
        slides.push(
          <div className="slide">
            <p>{repCeil} x {this.props.settings.baseBarbell + 'kg'}</p>
          </div>
        );
      }
    }
    else if(isBarebell){
      const steps = [30, 60, 80];
      steps.map((value) => {
        const baseBarbell = parseInt(this.props.settings.baseBarbell, 10);
        const slideValue = (handicap * value)/100 > baseBarbell ? (handicap * value)/100 : baseBarbell;  
        slides.push(
          <div className="slide">
            <p>{repCeil} x {Math.floor(slideValue) + 'kg'}</p>
          </div>
        );
        return slides;
      });
    }
    else{
      const steps = [30, 60, 80];

      steps.map((value) => {
        const slideValue = (handicap * value)/100 > 5 ? (handicap * value)/100 : 5;  
        slides.push(
          <div className="slide">
            <p>{repCeil} x {Math.floor(slideValue) + 'kg'}</p>
          </div>
        );

        return slides;
      });
    }

    const warmupSlides = slides.map((value, index) => 
      <div className={index !== 0  ? 'warmup-content visible' : 'warmup-content  visible'} key={'slide-' + index }>
        <h3>Série {index + 1}</h3>
        {value}
      </div>
    )


    const displayStatus = this.props.shouldAppear;
    return (
      <div className={"routineLauncher popin " + displayStatus}>
        <div className="contents">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">Échauffement <small>{this.props.name}</small></h3>
              <button className="closer" onClick={this.closeModal}>Close modal</button>
            </div>
            <div className="panel-body">
              {warmupSlides}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

WarmUp.propTypes = {
  shouldAppear: PropTypes.string.isRequired,
}

export default WarmUp;
