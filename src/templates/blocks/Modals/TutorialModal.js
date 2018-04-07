import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';

class TutorialModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: null,
      activeSlide: 0,
      forceTriangles: false
    };
    this.closeModal = this.closeModal.bind(this);
    this.navigate = this.navigate.bind(this);
    this.makeTriangles = this.makeTriangles.bind(this);
    this.togglePolygons = this.togglePolygons.bind(this);
  }

  componentDidMount() {
    const _this = this;
    this.makeTriangles(this.polygonTarget);
    window.addEventListener('resize', this.makeTriangles(this.polygonTarget));
    setTimeout(function() {
      _this.togglePolygons();
      _this.setState({
        visible: ' visible',
        forceTriangles: true
      });
    }, 100);
  }

  componentDidUpdate() {
    if (this.activeEntry) {
      this.activeEntry.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'end'
      });
    }
  }

  closeModal() {
    const _this = this;
    this.togglePolygons();
    this.setState({
      visible: ' visible exiting',
      forceTriangles: false
    });
    setTimeout(function() {
      // References the parent method for displaying a modal that's in Dashboard.js
      _this.props.closeModal();
    }, 400);
  }

  componentWillUnmount() {
    window.removeEventListener(
      'resize',
      this.makeTriangles(this.polygonTarget)
    );
  }

  navigate(index) {
    this.setState({
      activeSlide: index
    });
  }

  makeTriangles(container) {
    const _this = this;
    // Target the element where the result will be offloaded
    const element = container;
    element.innerHTML = '';

    // Size-up the screen to calculate triangle sizes
    const width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    const height =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;

    // We're going for about 8 triangles per line, twice as long as they're tall
    const triangleWidth = Math.ceil(width / 6),
      triangleHeight = Math.ceil(triangleWidth / 2);

    // And thus figure out the number of lines to produce
    const numberofLines = Math.ceil(height / triangleHeight);

    // The polygon factory will output the correct polygon depending on line variables
    function makePolygon(
      randomNumber,
      orientation,
      start,
      verticalOffset,
      reverse
    ) {
      // First, we create the "polygon" dom element
      const polygon = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'polygon'
      );
      polygon.setAttribute('class', 'polygon');
      // That polygon will get no stroke from us, no sir.
      polygon.setAttribute('stroke-width', 0);
      // We also give it a delay value derived from the random number
      polygon.setAttribute('data-delay', randomNumber);
      // Also, look pretty
      polygon.setAttribute('shape-rendering', 'crispEdges');

      // Also, if the pop-in is closed, then we don't display that polygon, it'd ruin the effect
      let displayStatus = 'none';
      if (_this.state.forceTriangles) {
        displayStatus = 'block';
      }
      polygon.setAttribute('style', 'display:' + displayStatus);

      if (reverse) {
        orientation = !orientation;
      }

      // Depending on the orientation (true or false), we output the right kind of triangle
      switch (orientation) {
        case true:
          // Triangle with bottom-facing point
          polygon.setAttribute(
            'points',
            start -
              1 +
              ',' +
              verticalOffset +
              ' ' +
              (start + triangleWidth + 1) +
              ',' +
              verticalOffset +
              ' ' +
              (start + triangleWidth / 2) +
              ',' +
              (verticalOffset + triangleHeight)
          );
          element.appendChild(polygon);
          break;

        case false:
          // Triangle with top-facing point
          polygon.setAttribute(
            'points',
            start +
              triangleWidth / 2 +
              ',' +
              verticalOffset +
              ' ' +
              (start - 1) +
              ',' +
              (verticalOffset + triangleHeight) +
              ' ' +
              (start + triangleWidth + 1) +
              ',' +
              (verticalOffset + triangleHeight)
          );
          element.appendChild(polygon);
          break;

        default:
          return false;
      }
    }

    // The line factory (outputs polygons in the number required to fill a line)
    function makeLine(index, offset) {
      // The offset is the line number. Each increments pushes the polygon down.
      let verticalOffset = Number(offset);

      // For 8 triangles a line, we actually build 18 to fill the white space.
      for (let i = 0; i < 14; i++) {
        // We figure out whether the line is even or odd
        // We also calculate the horizontal offset: how much of the triangle needs to be off screen to fill the white space at the start of the line
        let horizontalOffset = triangleWidth * i - triangleWidth / 2,
          evenLine = index % 2 === 0;

        // A random number bewteen 100 and 500 is picked
        // It will be used to delay the animation of the polygon
        let randomNumber = Math.floor(Math.random() * (400 - 0 + 1) + 0);

        // Next we figure out where the box in which the polygon is drawn starts on the line.
        let start = horizontalOffset - i * (triangleWidth / 2);
        if (evenLine) {
          makePolygon(randomNumber, i % 2 === 0, start, verticalOffset);
        } else {
          makePolygon(randomNumber, i % 2 === 0, start, verticalOffset, true);
        }
      }
    }

    for (let x = 0; x < numberofLines; x++) {
      let offset = triangleHeight * x;
      makeLine(x, offset);
    }
  }

  togglePolygons() {
    const polys = document.getElementsByClassName('polygon');
    Array.from(polys).forEach(item => {
      const isVisible = item.getAttribute('style') === 'display:block';

      const delay = Number(item.getAttribute('data-delay'));
      let visibleValue = isVisible ? 'none' : 'block';
      setTimeout(() => {
        item.setAttribute('style', 'display:' + visibleValue);
      }, delay);
    });
  }

  render() {
    const slides = [
      {
        title: 'Introduction',
        content: (
          <Fragment>
            <div className="splash large">
              <h1 className="logo">
                fit<strong>app</strong>
              </h1>
              <h2 className="card-title">Bienvenue !</h2>
            </div>
            <div className="content hero">
              <p>
                <strong>Fitapp</strong> est un journal d'entraînement. Créez vos
                routines, suivez vos records et progressez&nbsp;!
              </p>
            </div>
          </Fragment>
        )
      },
      {
        title: 'Créer une routine',
        content: (
          <Fragment>
            <div className="splash">
              <h2 className="card-title">Créer une routine</h2>
            </div>
            <div className="content">
              <h3>Qu'est-ce qu'une routine ?</h3>
              <p>
                Une routine est une série d'exercices que vous souhaitez
                réaliser lors d'un entraînement. Vous êtes totalement libre de
                créer la routine qui vous convient, quand elle vous convient.
              </p>
              <p>
                De nombreux programmes d'entraînement reposent sur une
                alternance entre deux ou trois routines par semaine et Fitapp a
                été créée avec cette philosophie en tête.
              </p>

              <h3>Comment créer une routine ?</h3>
              <p>
                Le plus rapide est d'utiliser la barre de menu principale.
                Identifiez l'icône{' '}
                <strong>
                  <FontAwesomeIcon icon={['fal', 'plus']} size="1x" /> New
                </strong>{' '}
                et cliquez dessus.
              </p>
              <p>
                L'éditeur vous permettra ensuite de choisir les exercices que
                vous souhaitez ajouter à cette routine.
              </p>
              <p>
                Le nom de la routine est bien-sûr paramétrable&nbsp;! Choisissez
                un titre évocateur pour vous comme "Routine bras et abdos",
                "Routine du Jeudi" ou "Cardio et Dos" par exemple.
              </p>

              <h3>Configurer mes exercices</h3>
              <p>
                Chaque exercice ajouté à la routine est paramétrable. Selon le
                type d'exercice choisi, vous pouvez modifier le nombre de "reps"
                (c'est à dire de répétitions) et de "sets" (c'est à dire de
                séries de répétitions). Certains exercices proposent également
                de modifier soit le poids de résistance à appliquer à cet
                exercice ou bien simplement le nombre de minutes à atteindre.
              </p>
            </div>
          </Fragment>
        )
      },
      {
        title: 'Modifier une routine',
        content: (
          <Fragment>
            <div className="splash">
              <h2 className="card-title">Modifier une routine</h2>
            </div>
            <div className="content">
              <h3>Pendant un entraînement</h3>
              <p>
                Vous pouvez ajuster certains éléments de la routine en cours
                d'entraînement&nbsp;:&nbsp;chaque exercice vous donne l'option
                de modifier son paramètre de "handicap"&nbsp;:&nbsp;poids à
                soulever, résistance ou minutes d'effort.
              </p>
              <p>
                Une fois l'entraînement terminé, l'option d'enregistrer ces
                modifications vous sera proposée.
              </p>

              <h3>Hors entraînement</h3>
              <p>
                Modifier une routine se fait via la page "Mes entraînements",
                que vous trouverez rapidement via la barre de menu principale.
                Identifiez l'icône{' '}
                <strong>
                  <FontAwesomeIcon icon={['fas', 'file']} size="1x" /> All
                </strong>{' '}
                et cliquez-dessus.
              </p>
              <p>
                Cliquez ensuite sur le bouton "Modifier" sous la routine
                concernée. Vous pourrez ensuite modifier tous les paramètres de
                la routine que vous avez créé.
              </p>
            </div>
          </Fragment>
        )
      },
      {
        title: 'Mode entraînement',
        content: (
          <Fragment>
            <div className="splash">
              <h2 className="card-title">Mode entraînement</h2>
            </div>
            <div className="content">
              <h3>Lancer un entraînement</h3>
              <p>
                Pour commencer votre scéance, il suffit de lancer un
                entraînement. Rien de plus simple, dans la barre de menu
                principale, identifiez l'icône{' '}
                <strong>
                  <FontAwesomeIcon icon={['fas', 'play']} size="1x" />
                </strong>{' '}
                et cliquez-dessus.
              </p>
              <p>
                Une liste des routines disponibles apparait alors. Choisissez
                celle qu'il vous faut, puis cliquez sur{' '}
                <strong>
                  <FontAwesomeIcon icon={['fas', 'play']} size="1x" /> Start!
                </strong>
              </p>

              <h3>Pendant l'entraînement</h3>
              <p>
                L'entraînement vous résume d'abord la liste des exercices à
                faire. Chaque objectif est détaillé&nbsp;:&nbsp;nombre de sets,
                de reps et poids / temps visé.
              </p>
              <p>
                Un compteur vous permet de constater l'état d'avancement de
                chaque exercice. Cliquez sur ce compteur pour vous lancer !
              </p>
              <p>
                L'écran d'exercice vous permet de modifier l'élement de
                "handicap" (poids ou temps), mais surtout doit vous servir à
                rapporter votre progression via les gauges. Vous pouvez soit
                faire coulisser celles-ci, soit utiliser les boutons{' '}
                <strong>
                  <FontAwesomeIcon icon={['fas', 'plus']} size="1x" />
                </strong>{' '}
                et{' '}
                <strong>
                  <FontAwesomeIcon icon={['fas', 'minus']} size="1x" />
                </strong>.
              </p>

              <h3>Fin d'entraînement</h3>
              <p>
                Lorsque vous avez terminé votre entraînement, il vous suffit de
                revenir à l'écran "Tous les exercices", puis de sélectionner
                "Terminer l'entraînement" en bas de page.
              </p>
              <p>
                Une fenêtre contextuelle s'ouvre alors. Celle-ci contiendra
                différentes informations en fonction de vos interactions lors de
                la scéance :
              </p>
              <ul>
                <li>
                  Si vous avez modifié le poids / les minutes d'au moins un
                  exercice, l'option d'enregistrer cette modification vous sera
                  proposée.
                </li>
                <li>
                  Si vous avez atteint vos objectifs (rapporté toutes les reps
                  pour tous les sets prévus) pour au moins un exercice, l'option
                  de rendre cette exercice plus difficile à la prochaine scéance
                  vous sera proposée.
                </li>
                <li>
                  Si vous avez activé le timer pendant votre scéance, l'option
                  de jauger l'intensité de l'entraînement vous sera proposée. Si
                  votre poids a été renseigné dans vos paramètres, cette donnée
                  servira à établir une estimation de la dépense calorique
                  générée par cette scéance&nbsp;!
                </li>
              </ul>
              <p>
                Il vous suffit ensuite de valider l'enregistrement de votre
                entraînement afin d'être redirigé vers l'écran d'acceuil.
              </p>
            </div>
          </Fragment>
        )
      },
      {
        title: 'Échauffement',
        content: (
          <Fragment>
            <div className="splash">
              <h2 className="card-title">Échauffement</h2>
            </div>
            <div className="content">
              <h3>Exercices avec poids</h3>
              <p>
                Pour chaque exercice utilisant des poids, Fitapp vous propose un
                bouton "Échauffement". Celui-ci ouvre une fenêtre contextuelle
                contenant un programme d'échauffement basé sur les paramètres de
                l'exercice.
              </p>
              <p>
                Un échauffement se décompose en 5 sets d'autant de reps que
                l'exercice final. Les deux premiers sets utilisent le moins de
                poids possible&nbsp;:&nbsp;l'idée est de reprendre le geste en
                main.
              </p>
              <p>
                Les trois sets restants utilisent 40%, 60% puis 80% du poids
                final afin d'habituer progressivement le corps à la charge
                totale. Souvenez-vous&nbsp;:&nbsp;le but de l'échauffement n'est
                pas de vous fatiguer, mais de vous préparer&nbsp;!
              </p>

              <h3>Exercices sans poids</h3>
              <p>
                L'application ne vous proposera pas d'options d'échauffement,
                mais n'oubliez pas de vous étirer&nbsp;!
              </p>
            </div>
          </Fragment>
        )
      },
      {
        title: 'Paramètres',
        content: (
          <Fragment>
            <div className="splash">
              <h2 className="card-title">Paramètres</h2>
            </div>
            <div className="content">
              <h3>Modifier les poids (disques) disponibles</h3>
              <p>
                Les exercices utilisant la barre et les disques libres
                proposent, en mode entraînement, un outil vous permettant de
                savoir quels disques placer de chaque coté de la barre. Afin de
                vous assurer que ces renseignements correspondent aux disques à
                votre disposition, renzeignez-les dans vos paramètres&nbsp;!
              </p>

              <p>
                Ouvrez le{' '}
                <strong>
                  <FontAwesomeIcon icon={['fal', 'bars']} size="1x" /> Menu
                </strong>{' '}
                dans la barre de navigation principale, puis navigez vers{' '}
                <strong>
                  <FontAwesomeIcon icon={['fas', 'cog']} size="1x" /> Paramètres
                </strong>. Vous y trouverez de quoi choisir le poids de la barre
                vide, ansi que des interrupteurs représentant les disques
                disponibles.
              </p>

              <h3>Modifier mes informations ou supprimer mon compte</h3>
              <p>
                La page{' '}
                <strong>
                  <FontAwesomeIcon icon={['fas', 'cog']} size="1x" /> Paramètres
                </strong>{' '}
                vous permet également de modifier votre nom, email de contact et
                image de profil. Afin de calculer une estimation de la dépense
                calorique de vos scéances, nous vous invitons également à
                renseigner votre poids.
              </p>
              <p>
                Si vous souhaitez supprimer votre compte, vous trouverez
                l'option également sur cette page.
              </p>
            </div>
          </Fragment>
        )
      }
    ];

    return (
      <div className={'modal tutorialModal ' + this.state.visible}>
        <div className="timeline">
          <ul className="chapters">
            {slides.map((item, index) => {
              return (
                <li key={'navIndex-' + index}>
                  <button
                    onClick={this.navigate.bind(this, index)}
                    className={
                      index === this.state.activeSlide ? 'active' : null
                    }
                    ref={
                      this.state.activeSlide === index
                        ? entry => {
                            this.activeEntry = entry;
                          }
                        : null
                    }>
                    {item.title}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="cards">
          {slides.map((item, index) => {
            let currentClass = null,
              positionTransform = 'rotateY(0deg) scale(1)';
            if (index - this.state.activeSlide === 0) {
              currentClass = 'active';
            }
            if (Math.sign(index - this.state.activeSlide) === 1) {
              currentClass = 'next';
              positionTransform = 'rotateY(-10deg) scale(0.9)';
            }
            if (Math.sign(index - this.state.activeSlide) === -1) {
              currentClass = 'previous';
              positionTransform = 'rotateY(10deg) scale(0.9)';
            }

            let style = {
              transform: `translateY(-15px) translateX(${100 *
                (index - this.state.activeSlide)}%) ${positionTransform}`,
              filter: `blur(${
                index === this.state.activeSlide ? '0px' : '5px'
              })`
            };

            return (
              <div
                className={'card ' + currentClass}
                key={'cardIndex-' + index}
                style={style}>
                {item.content}
              </div>
            );
          })}
        </div>

        <div className="navigation">
          <button
            className="direction"
            disabled={this.state.activeSlide === 0}
            onClick={this.navigate.bind(
              this,
              this.state.activeSlide - 1 > 0 ? this.state.activeSlide - 1 : 0
            )}>
            <FontAwesomeIcon icon={['fas', 'angle-left']} size="1x" /> Précedent
          </button>
          <button
            className="direction"
            disabled={this.state.activeSlide === slides.length - 1}
            onClick={this.navigate.bind(
              this,
              this.state.activeSlide + 1 > slides.length - 1
                ? this.state.activeSlide
                : this.state.activeSlide + 1
            )}>
            Suivant <FontAwesomeIcon icon={['fas', 'angle-right']} size="1x" />
          </button>
          <button className="close" onClick={this.closeModal}>
            Fermer le tutoriel
          </button>
          <p>
            Cette aide est disponible à tout moment depuis le{' '}
            <strong>
              <FontAwesomeIcon icon={['far', 'bars']} size="1x" /> Menu
            </strong>.
          </p>
        </div>

        <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath
              id="clipPath"
              ref={polygonTarget => {
                this.polygonTarget = polygonTarget;
              }}
            />
          </defs>
        </svg>
      </div>
    );
  }
}

TutorialModal.propTypes = {
  closeModal: PropTypes.func.isRequired
};

export default TutorialModal;
