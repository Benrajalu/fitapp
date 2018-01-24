import React from "react";

const Loader = ({active}) => {
  let displayClass;

  switch(active){
    case 'WILL_LOAD':
      displayClass = 'visible opaque';
    break;
    case 'LOADING':
      displayClass = 'visible opaque nowLoading';
    break;
    case 'DONE_LOADING':
      displayClass = 'visible';
    break;
    case 'NO_LOAD':
      displayClass = 'hidden';
    break;
    default:
      displayClass = 'hidden';
  };

  return(
    <div className={ displayClass + ' loader'}>
      <i className="bit"></i>
      <i className="bit"></i>
    </div>
  )
};

export default Loader;