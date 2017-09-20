import React, { Component } from 'react';
import PropTypes from 'prop-types';

class BarbellLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      remainingWeight:false, 
      finalLoads: {}
    }
  }

  componentDidMount() {
    // Decompose a weight into loads using only available weights set in settings: 
    // First, sort weights in settings from heavier to lighter
    function sortNumber(a,b) {
      return a - b;
    }
    
    const rack = this.props.settings.availableWeights.sort(sortNumber).reverse();

    let finalLoads = this.state.finalLoads, 
        _this = this;
    
    // Decompose the weight in individua loads, aiming for heavier discs first
    function decomposeWeight(rack, weight, startingPoint, container) {    
      // The poolsize will be echausted when all the rack's options are spent
      // The actual weight is divided by 2, we only calculate how to fill one side of the barbell 
      const poolSize = rack.length, 
          actualWeight = weight/2; 

      if(startingPoint > poolSize -1){
        // Exhausted all rack options, still some weight to add, we flag it down the state
        _this.setState({
          remainingWeight: weight
        })
      }
      else if(weight === 0){
        // All weight has been accounted for ! Yay ! 
        _this.setState({
          remainingWeight: false
        })
      }
      else if(actualWeight - rack[startingPoint] < 0){
        // Moving down the ract to try and shave off the weight objective (current weight too big!)
        decomposeWeight(rack, weight, startingPoint + 1, container);
      }
      else if(actualWeight - rack[startingPoint] >= 0){
        // Can substract, so adding +1 to that weight ! 
        const remains = weight - (rack[startingPoint] * 2);
        container[rack[startingPoint]] = container[rack[startingPoint]] > 0 ? container[rack[startingPoint]] + 1 : 1;
        decomposeWeight(rack, remains, startingPoint, container);
      }
      else{
        console.log("error:");
        console.log(weight);
        console.log(rack);
        console.log(startingPoint);
        console.log(poolSize);
      }
      return container;
    }
    decomposeWeight(rack, this.props.weight - parseInt(this.props.settings.baseBarbell, 10), 0, finalLoads);

    this.setState({
      finalLoads: finalLoads
    });
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.weight !== this.props.weight){      
      // Decompose a weight into loads using only available weights set in settings: 
      // First, sort weights in settings from heavier to lighter
      function sortNumber(a,b) {
        return a - b;
      }
      
      // Initializing the "rack" : what discs are available ? 
      const rack = this.props.settings.availableWeights.sort(sortNumber).reverse();
      
      // Initializing the container (always empty before the fonction hits it)
      let finalLoads = {};

      // Ensuring the state knnows we're talking to it
      const _this = this;
      
      // Decompose the weight in individua loads, aiming for heavier discs first
      function decomposeWeight(rack, weight, startingPoint, container) {    
        // The poolsize will be echausted when all the rack's options are spent
        // The actual weight is divided by 2, we only calculate how to fill one side of the barbell 
        const poolSize = rack.length, 
            actualWeight = weight/2; 

        if(startingPoint > poolSize -1){
          // Exhausted all rack options, still some weight to add, we flag it down the state
          _this.setState({
            remainingWeight: weight
          })
        }
        else if(weight === 0){
          // All weight has been accounted for ! Yay ! 
          _this.setState({
            remainingWeight: false
          })
        }
        else if(actualWeight - rack[startingPoint] < 0){
          // Moving down the ract to try and shave off the weight objective (current weight too big!)
          decomposeWeight(rack, weight, startingPoint + 1, container);
        }
        else if(actualWeight - rack[startingPoint] >= 0){
          // Can substract, so adding +1 to that weight ! 
          const remains = weight - (rack[startingPoint] * 2);
          container[rack[startingPoint]] = container[rack[startingPoint]] > 0 ? container[rack[startingPoint]] + 1 : 1;
          decomposeWeight(rack, remains, startingPoint, container);
        }
        else{
          console.log("error:");
          console.log(weight);
          console.log(rack);
          console.log(startingPoint);
          console.log(poolSize);
        }
        return container;
      }
      decomposeWeight(rack, this.props.weight - parseInt(this.props.settings.baseBarbell, 10), 0, finalLoads);
      
      // Updating the component with its weight list 
      this.setState({
        finalLoads: finalLoads
      });
    }
  }

  render() {
    // We must forst ensure that discs are sorted by lightest to heaviest
    // So I take the raw output (unsorted object)
    // and sort its keys
    let unorderedLoads = this.state.finalLoads,
        orderedKeys = Object.keys(unorderedLoads).sort((a,b) => {return a - b}),
        loadsToUse= [];

    // Its keys and values are then fed into a properly sorted array 
    orderedKeys.map((key, index) => {
      let newKey = orderedKeys[index];
      return loadsToUse[index] = { [newKey] : unorderedLoads[key]};
    });
    

    // If the weight is the same as the user's setting base barbell, then display the empty barebell 
    let loadHelper = <div className="load"></div>;
    if(this.props.weight === parseInt(this.props.settings.baseBarbell, 10)){
      loadHelper = <div className="load"><div className="barbell">{this.props.settings.baseBarbell + 'kg'}</div></div>
    }
    else{
      // If not, then we'll display discs
      const loadsWrapper = [];
      // For each type of disc needed...
      for(let y = 0; y < loadsToUse.length; y++){
        // For each number of that type of disc...
        for(let z = 0; z < loadsToUse[y][orderedKeys[y]]; z++){
          // Then push a dsic in the loadsWrapper array
          let discSize = "disc size-" + orderedKeys[y].replace('.', '-');
          loadsWrapper.push(<div className={discSize} key={'disc-' + z + ' - ' + y}>{orderedKeys[y]} kg</div> )
        }
      }
      // And then display the results
      loadHelper = <div className="load"><div className="barbell">{this.props.settings.baseBarbell + 'kg'}</div>{loadsWrapper}</div>;
    }
  
    return (
      <div>
        {loadHelper}
      </div>
    )
  }
}

BarbellLoader.propTypes = {
  settings: PropTypes.object.isRequired,
  weight: PropTypes.number.isRequired
}

export default BarbellLoader;
