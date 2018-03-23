import { connect } from 'react-redux';
import Loader from '../blocks/Loader.js';

const mapStateToProps = (state, ownProps) => {
  return {
    active: state.loading.status
  };
};

const AwareLoader = connect(mapStateToProps)(Loader);

export default AwareLoader;
