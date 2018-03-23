import React from 'react';
import InlineLoader from '../blocks/InlineLoader';

const Loader = ({ active }) => {
  let displayClass;

  switch (active) {
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
  }

  const tips = [
    'Une "routine" est un programme d\'entraînement que vous créez. Utilisez l\'icône "+" du menu principal.',
    "Pensez à activer le timer pendant un scéance ! En bas à gauche de l'écran, il vous permettra de mieux mesurer vos entraînements.",
    'Un set est une série de "reps", c\'est à dire de répétitions du geste en question. Un set de 5 reps de squats est donc une série de 5 squats.',
    "Le nom d'un exercice ne vous dit rien ? Regardez les démos Youtube afin de vous en faire une idée.",
    "Si vous renseignez votre poids dans vos paramètres et que vous chronométrez vos scéance, fitapp calculera l'estimation calorique de votre entraînement.",
    "Vous avez complété tous vos sets prévus ? Au moment d'enregistrer la scéance, fitapp vous proposera de la rendre plus difficile la prochaine fois !"
  ];

  function newTip() {
    return Math.floor(Math.random() * tips.length);
  }

  return (
    <div className={displayClass + ' loader'}>
      <div className="top">
        <div className="copy">
          <p className="tip">{tips[newTip()]}</p>
        </div>
      </div>
      <div className="bottom">
        <div className="copy">
          <InlineLoader copy={' '} />
          <p className="name">
            fit<strong>app</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loader;
