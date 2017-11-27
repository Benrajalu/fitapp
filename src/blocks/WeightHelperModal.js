import React, { Component } from 'react';
import PropTypes from 'prop-types';

import BarbellLoader from '../blocks/BarbellLoader';

class WeightHelperModal extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.moveSlider = this.moveSlider.bind(this);
    this.activeWindow = this.activeWindow.bind(this);
    this.state = {
      animate: " animate", 
      currentIndex: 0, 
      activeWindow: this.props.targetWindow
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

  activeWindow(window){
    this.setState({
      activeWindow: window
    })
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
    let slides = [], 
        indexes = [this.props.settings.baseBarbell + 'kg', this.props.settings.baseBarbell + 'kg'];

    // Slide 1, 2
    slides.push(
      <div className={isBarebell ? "slide" : "slide no-barbell"}>
        <p>{repCeil} x {isBarebell ? this.props.settings.baseBarbell + 'kg' : '5kg' }</p>
        {isBarebell ? <BarbellLoader settings={this.props.settings} weight={parseInt(this.props.settings.baseBarbell, 10)} /> : false }
      </div>
    );
    slides.push(
      <div className={isBarebell ? "slide" : "slide no-barbell"}>
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
        indexes.push(this.props.settings.baseBarbell + 'kg');
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
        indexes.push(Math.floor(slideValue / 5) * 5 + 'kg');
        return slides;
      });
    }
    else{
      const steps = [40, 60, 80];

      steps.map((value) => {
        const slideValue = (handicap * value)/100 > 5 ? (handicap * value)/100 : 5;  
        slides.push(
          <div className="slide no-barbell">
            <p>{repCeil} x {Math.floor(slideValue) + 'kg'}</p>
          </div>
        );
        indexes.push(Math.floor(slideValue / 5) * 5 + 'kg');

        return slides;
      });
    }

    const warmupSlides = slides.map((value, index) => 
      <div className={index === this.state.currentIndex  ? 'warmup-content visible' : 'warmup-content  hidden'} key={'slide-' + index }>
        {value}
      </div>
    )

    const warmupSequences = indexes.map((value, index) => {
      let status;
      if(index === this.state.currentIndex){
        status = "active";
      }
      else if(index < this.state.currentIndex){
        status = "done";
      }
      else{
        status = null
      }
      return <div className={"index " + status} key={'index-' + index }>
        <h3>{index + 1}/5</h3>
        <p>{value}</p>
      </div>
    })


    const displayStatus = this.props.shouldAppear;
    return (
      <div className={"popin slider " + displayStatus + this.state.animate}>
        <div className="modal-contents">
          <div className="container">
            <div className={isBarebell ? "panel warmup" : "panel warmup no-barbell"}>
              <button className="closer" onClick={this.closeModal} title="Fermer"><i className="fa fa-close"></i></button>
              {isBarebell ? 
                <div className="panel-status">
                  <button className={this.state.activeWindow === "warmup" ? "active" : null} onClick={this.activeWindow.bind(this, 'warmup')}>Échauffement</button>
                  <button className={this.state.activeWindow === "loadout" ? "active" : null} onClick={this.activeWindow.bind(this, 'loadout')}>Barre finale</button>
                </div>
                :
                false
              }
              <div className="tabs-zone">
                <div className={this.state.activeWindow === "warmup" ? "panel-tab active" : "panel-tab"}>
                  <div className="panel-heading">
                    <p className="title">Échauffement <small>{this.props.name}</small></p>
                  </div>
                  <div className="panel-sub">
                    {warmupSequences}
                  </div>
                  <div className="panel-body">
                    {warmupSlides}
                  </div>
                  <div className="panel-footer">
                    {this.state.currentIndex === 0 ? 
                      <button disabled="true"><i className="fa fa-angle-left"></i></button>
                      :
                      <button onClick={this.moveSlider.bind(this, "previous")}><i className="fa fa-angle-left"></i></button>
                    }
                    {isBarebell && this.state.currentIndex === (indexes.length - 1) ? 
                      <button onClick={this.activeWindow.bind(this, "loadout")}>Barre finale</button>
                      :
                      false
                    }
                    {this.state.currentIndex === (indexes.length - 1) && !isBarebell ? 
                      <button disabled="disabled"><i className="fa fa-angle-right"></i></button>
                      :
                      false
                    }
                    {this.state.currentIndex < (indexes.length - 1) ? 
                      <button onClick={this.moveSlider.bind(this, "next")}><i className="fa fa-angle-right"></i></button>
                      : 
                      false
                    }
                  </div>
                </div>
                {isBarebell ?
                  <div className={this.state.activeWindow === "loadout" ? "panel-tab active" : "panel-tab"}>
                    <div className="panel-heading">
                      <p className="title">Barre finale <br/><small>{this.props.name}</small></p>
                    </div>
                    <div className="panel-body">
                      <div className="warmup-content visible">
                        <div className="slide">
                          <p>{repCeil} x {handicap}kg</p>
                          <BarbellLoader settings={this.props.settings} weight={parseFloat(handicap)} />
                        </div>
                      </div>
                    </div>
                  </div>
                  :
                  false
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

WeightHelperModal.propTypes = {
  shouldAppear: PropTypes.string.isRequired,
}

export default WeightHelperModal;
