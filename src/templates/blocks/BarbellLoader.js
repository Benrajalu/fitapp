import React, { Component } from 'react';
import PropTypes from 'prop-types';

import uuid from 'uuid';

class BarbellLoader extends Component {
  constructor(props) {
    super(props);
    this.decomposeWeight = this.decomposeWeight.bind(this);
    this.state = {
      remainingWeight: false,
      finalLoads: {}
    };
  }

  decomposeWeight(rack, weight, startingPoint, container) {
    // The poolsize will be echausted when all the rack's options are spent
    // The actual weight is divided by 2, we only calculate how to fill one side of the barbell
    const poolSize = rack.length,
      barbell = parseFloat(this.props.settings.baseBarbell),
      actualWeight = (weight - barbell) / 2;

    if (weight === barbell) {
      // All weight has been accounted for ! Yay !
      this.setState({
        remainingWeight: false
      });
    } else if (startingPoint >= poolSize) {
      // Exhausted all rack options, still some weight to add, we flag it down the state
      this.setState({
        remainingWeight: weight
      });
    } else if (actualWeight - rack[startingPoint] < 0) {
      // Moving down the rack to try and shave off the weight objective (current weight too big!)
      this.decomposeWeight(rack, weight, startingPoint + 1, container);
    } else if (actualWeight - rack[startingPoint] >= 0) {
      // Can substract, so adding +1 to that weight !
      const remains = weight - rack[startingPoint] * 2;
      container[rack[startingPoint]] =
        container[rack[startingPoint]] > 0
          ? container[rack[startingPoint]] + 1
          : 1;
      this.decomposeWeight(rack, remains, startingPoint, container);
    } else {
      console.log('error:');
      console.log(weight);
      console.log(rack);
      console.log(startingPoint);
      console.log(poolSize);
    }
    return container;
  }

  componentDidMount() {
    // Decompose a weight into loads using only available weights set in settings:
    // Initializing the "rack" : what discs are available ?
    const rack = this.props.settings.availableWeights
      .sort((a, b) => {
        return a - b;
      })
      .reverse();
    // Initializing the container (always empty before the fonction hits it)
    let finalLoads = {};
    // Decomposing that weight
    this.decomposeWeight(rack, this.props.weight, 0, finalLoads);
    this.setState({
      finalLoads: finalLoads
    });
  }

  render() {
    // We must first ensure that discs are sorted by lightest to heaviest
    // So I take the raw output (unsorted object)
    // and sort its keys (which are weights - weight: numberofuses)
    let unorderedLoads = this.state.finalLoads,
      orderedKeys = Object.keys(unorderedLoads).sort((a, b) => {
        return a - b;
      }),
      loadsToUse = [];

    // Its keys and values are then fed into a properly sorted array
    orderedKeys.map((key, index) => {
      let newKey = orderedKeys[index];
      return (loadsToUse[index] = { [newKey]: unorderedLoads[key] });
    });

    // If the weight is the same as the user's setting base barbell, then display the empty barebell
    let loadHelper = <div className="load" />;
    if (this.props.weight === parseFloat(this.props.settings.baseBarbell)) {
      loadHelper = (
        <div className="load">
          <div className="barbell">
            <span className="barWeight">
              {this.props.settings.baseBarbell + 'kg'}
            </span>
          </div>
        </div>
      );
    } else {
      // If not, then we'll display discs
      const loadsWrapper = [];
      // For each type of disc needed...
      for (let y = 0; y < loadsToUse.length; y++) {
        // For each number of that type of disc...
        for (let z = 0; z < loadsToUse[y][orderedKeys[y]]; z++) {
          // Then push a dsic in the loadsWrapper array
          let discSize = 'disc size-' + orderedKeys[y].replace('.', '-');
          loadsWrapper.push(
            <div className={discSize} key={'disc-' + uuid.v1()}>
              <p>{orderedKeys[y]} kg</p>
            </div>
          );
        }
      }
      // And then display the results
      loadHelper = (
        <div className="load">
          <div className="barbell">
            <span className="barWeight">
              {this.props.settings.baseBarbell + 'kg'}
            </span>
          </div>
          {loadsWrapper}
        </div>
      );
    }

    let weightNotReached = (
      <div>
        {this.state.remainingWeight ? (
          <div className="alert alert-info">
            Poids calculé{' '}
            <strong>
              {' '}
              {this.state.remainingWeight - this.props.settings.baseBarbell > 0
                ? '-'
                : '+'}
              {this.state.remainingWeight - this.props.settings.baseBarbell > 0
                ? this.state.remainingWeight - this.props.settings.baseBarbell
                : (this.state.remainingWeight -
                    this.props.settings.baseBarbell) *
                  -1}kg
            </strong>{' '}
            (disques non disponibles)
          </div>
        ) : (
          false
        )}
      </div>
    );

    return (
      <div className="barbellLoader">
        {loadHelper}
        {weightNotReached}
      </div>
    );
  }
}

BarbellLoader.propTypes = {
  settings: PropTypes.object.isRequired,
  weight: PropTypes.number.isRequired
};

export default BarbellLoader;
