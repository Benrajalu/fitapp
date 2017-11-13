import React, { Component } from 'react';
import PropTypes from 'prop-types';

import BarbellLoader from '../blocks/BarbellLoader';

class WarmUp extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.moveSlider = this.moveSlider.bind(this);
    this.state = {
      animate: " animate", 
      currentIndex: 0 
    } 
  }
  closeModal() {
    const _this = this;
    this.setState({
      animate: " animate"
    });
    setTimeout(function(){
      // References the parent method for displaying a modal that's in Dashboard.js
      _this.props.closeModal();
    }, 300);
  }

  moveSlider(direction){
    console.log(direction);
    if(direction === "next"){
      this.setState({
        currentIndex: this.state.currentIndex < 4 ? this.state.currentIndex + 1 : 4
      })
    }
    else{
      this.setState({
        currentIndex: this.state.currentIndex > 0 ? this.state.currentIndex - 1 : 0
      })  
    }
  }


  componentDidMount() {
    const _this = this;
    setTimeout(function(){
      _this.setState({
        animate: false
      })
    }, 100);
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

    // initialiszing warmup array of "slides"
    let slides = [];

    // Slide 1, 2
    slides.push(
      <div className="slide">
        <p>{repCeil} x {isBarebell ? this.props.settings.baseBarbell + 'kg' : '5kg' }</p>
        {isBarebell ? <BarbellLoader settings={this.props.settings} weight={parseInt(this.props.settings.baseBarbell, 10)} /> : false }
      </div>
    );
    slides.push(
      <div className="slide">
        <p>{repCeil} x {isBarebell ? this.props.settings.baseBarbell + 'kg' : '5kg' }</p>
        {isBarebell ? <BarbellLoader settings={this.props.settings} weight={parseInt(this.props.settings.baseBarbell, 10)} /> : false }
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
      const steps = [40, 60, 80];
      steps.map((value) => {
        const baseBarbell = parseInt(this.props.settings.baseBarbell, 10);
        const slideValue = (handicap * value)/100 > baseBarbell ? (handicap * value)/100 : baseBarbell;  
        slides.push(
          <div className="slide">
            <p>{repCeil} x {Math.floor(slideValue / 5) * 5 + 'kg'}</p>
            {isBarebell ? <BarbellLoader settings={this.props.settings} weight={Math.floor(slideValue / 5) * 5} /> : false }
          </div>
        );
        return slides;
      });
    }
    else{
      const steps = [40, 60, 80];

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
      <div className={index === this.state.currentIndex  ? 'warmup-content visible' : 'warmup-content  hidden'} key={'slide-' + index }>
        <h3>Série {index + 1} / 5</h3>
        {value}
      </div>
    )


    const displayStatus = this.props.shouldAppear;
    return (
      <div className={"popin " + displayStatus + this.state.animate}>
        <div className="modal-header">
          <div className="container">
            <p className="title">Échauffement <small>{this.props.name}</small></p>
            <button className="closer" onClick={this.closeModal}>Fermer</button>
          </div>
        </div>
        <div className="modal-contents">
          <div className="container">
            <div className="panel warmup">
              <div className="panel-heading">
                <h3 className="title">Séries d'échauffement</h3>
              </div>
              <div className="panel-body">
                {warmupSlides}
              </div>
              <div className="panel-footer">
                <button onClick={this.moveSlider.bind(this, "previous")}><i className="fa fa-angle-left"></i></button>
                <button onClick={this.moveSlider.bind(this, "next")}><i className="fa fa-angle-right"></i></button>
              </div>
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
