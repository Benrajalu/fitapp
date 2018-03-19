import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactCrop from 'react-image-crop';
import { connect } from 'react-redux';
import { database } from '../../store/';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import InlineLoader from '../blocks/InlineLoader';

import defaultAvatar from '../../images/default-avatar.png';

import { toggleModal } from '../../actions/ModalActions';

const mapStateToProps = state => {
  return {
    user: state.user,
    menu: state.menu,
    routines: state.routines,
    exercises: state.exercises
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleModal: value => {
      dispatch(toggleModal(value));
    }
  };
};

class Settings extends Component {
  constructor(props) {
    super(props);

    this.updateWeights = this.updateWeights.bind(this);
    this.updateBarbell = this.updateBarbell.bind(this);
    this.updateAccount = this.updateAccount.bind(this);
    this.updateImage = this.updateImage.bind(this);
    this.handleCrop = this.handleCrop.bind(this);
    this.handePreviewImage = this.handePreviewImage.bind(this);
    this.handleDefaultCrop = this.handleDefaultCrop.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.cancelNewPic = this.cancelNewPic.bind(this);
    this.togglePopin = this.togglePopin.bind(this);
    this.holdTimer = undefined;
    this.timer = 500;
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.repeat = this.repeat.bind(this);

    this.state = {
      user: { uid: '0' },
      mounted: false,
      userId: false,
      loading: true,
      userName: '',
      userPic: false,
      userEmail: '',
      userWeight: null,
      crop: {
        aspect: 1
      },
      settings: {
        baseBarbell: 0,
        availableWeights: []
      },
      wrongEmail: false,
      previewImage: undefined,
      animate: ' animate',
      isPressed: false
    };
  }

  componentDidMount() {
    document.title = 'FitApp. - Vos paramètres';
    const _this = this;
    this.setState({
      loading: false,
      userId: this.props.user.uid,
      settings: this.props.user.settings,
      userName: this.props.user.displayName,
      userPic: this.props.user.profilePicture,
      userEmail: this.props.user.contactEmail,
      userWeight: this.props.user.userWeight
        ? parseFloat(this.props.user.userWeight)
        : ''
    });
    setTimeout(() => {
      _this.setState({
        mounted: true
      });
    }, 200);
  }

  repeat(direction, event) {
    // Launch the tuner function
    let value;
    switch (direction) {
      case 'less':
        value =
          this.state.settings.baseBarbell > 0
            ? this.state.settings.baseBarbell - 1
            : 0;
        break;

      case 'more':
        value = this.state.settings.baseBarbell + 1;
        break;

      default:
        return false;
    }
    let fakeEvent = {
      target: {
        value: value
      }
    };
    this.updateBarbell(fakeEvent);
    const _this = this;
    // Set a promise to deliver the same function until the timer is stopped
    let promise = setTimeout(() => {
      _this.repeat(direction, event);
      this.timer = 200;
    }, this.timer);
    this.holdTimer = promise;
  }
  onMouseDown(direction, event) {
    // When button is down, prevent context menu
    window.oncontextmenu = function(event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    };
    // Launch the repeat function to then trigger the increase/decrease
    this.repeat(direction, event);
    this.setState({
      isPressed: true,
      direction: direction
    });
  }
  onMouseUp(event) {
    // When button is up, clear the timeout for the repeater
    clearTimeout(this.holdTimer);
    this.timer = 500;
    // And reinstate the context menu
    window.oncontextmenu = function(event) {
      return true;
    };
    this.setState({
      isPressed: false,
      direction: false
    });
  }

  updateWeights(event) {
    let target = parseFloat(event.target.value);

    const currentWeights = this.state.settings;
    if (this.state.settings.availableWeights.indexOf(target) !== -1) {
      const targetIndex = this.state.settings.availableWeights.indexOf(target);
      currentWeights.availableWeights.splice(targetIndex, 1);
    } else {
      currentWeights.availableWeights.push(target);
    }

    this.setState(
      {
        settings: currentWeights,
        savingWeights: 'saving'
      },
      () => {
        const updateQuery = database.collection('users').doc(this.state.userId),
          value = this.state.settings.availableWeights,
          _this = this;

        updateQuery
          .update({
            'settings.availableWeights': value
          })
          .then(function(response) {
            _this.setState({
              savingWeights: 'saved'
            });
            setTimeout(function() {
              _this.setState({
                savingWeights: false
              });
            }, 2000);
          })
          .catch(function(error) {
            console.log("That's a FALSE setting saved : " + error.message);
          });
      }
    );
  }

  updateBarbell(event) {
    let target = parseFloat(event.target.value);

    const currentSettings = this.state.settings;
    currentSettings.baseBarbell = target === 0 ? 1 : target;

    this.setState(
      {
        settings: currentSettings,
        savingBarbell: 'saving'
      },
      () => {
        const updateQuery = database.collection('users').doc(this.state.userId),
          value = this.state.settings.baseBarbell,
          _this = this;

        updateQuery
          .update({
            'settings.baseBarbell': value
          })
          .then(function(response) {
            _this.setState({
              savingBarbell: 'saved'
            });
            setTimeout(function() {
              _this.setState({
                savingBarbell: false
              });
            }, 2000);
          })
          .catch(function(error) {
            console.log("That's a FALSE setting saved : " + error.message);
          });
      }
    );
  }

  updateAccount(event) {
    let updatedField = event.target.name,
      value = false;
    const stateSnapshot = this.state;

    if (updatedField !== 'userImage') {
      value = event.target.value;
      if (updatedField === 'userEmail') {
        const regex = new RegExp(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
        let isValid = regex.test(value);
        if (isValid === false) {
          stateSnapshot.wrongEmail = true;
        } else {
          stateSnapshot.wrongEmail = false;
        }
      }
      stateSnapshot[updatedField] = value;
      this.setState(stateSnapshot);
    }
  }

  updateImage(event) {
    // Fires when users upload a new profile pic and displays a preview, in a cropper widget
    let reader = new FileReader(),
      file = event.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        newPic: reader.result
      });
    };

    reader.readAsDataURL(file);
  }

  handleCrop(crop, pixelCrop) {
    // Fires when users decide to re-crop their profile pics
    crop.aspect = 1 / 1.1;
    this.setState({
      crop: crop
    });
    this.handePreviewImage();
  }

  handleDefaultCrop(image) {
    function makeAspectCrop(crop, image) {
      var imageWidth = image.naturalWidth;
      var imageHeight = image.naturalHeight;
      var imageAspect = imageWidth / imageHeight;
      var completeCrop = crop;

      if (crop.width) {
        completeCrop.height = crop.width / crop.aspect * imageAspect;
      } else if (crop.height) {
        completeCrop.width = crop.height * crop.aspect / imageAspect;
      }

      if (crop.y + crop.height > 100) {
        completeCrop.height = 100 - crop.y;
        completeCrop.width = crop.height * crop.aspect / imageAspect;
      }

      if (crop.x + crop.width > 100) {
        completeCrop.width = 100 - crop.x;
        completeCrop.height = crop.width / crop.aspect * imageAspect;
      }

      return completeCrop;
    }

    if (image) {
      const defaultCrop = makeAspectCrop(
        {
          x: 25,
          y: 0,
          aspect: 1 / 1.1,
          width: 50
        },
        image
      );

      this.setState(
        {
          crop: defaultCrop
        },
        () => {
          this.handePreviewImage();
        }
      );
    }
  }

  handePreviewImage() {
    const cropImage = (imgSrc, crop) => {
      var image = new Image();
      image.onload = function(e) {
        image = null;
      };
      image.src = imgSrc;

      var imageWidth = image.naturalWidth;
      var imageHeight = image.naturalHeight;

      var cropX = crop.x / 100 * imageWidth;
      var cropY = crop.y / 100 * imageHeight;

      var cropWidth = crop.width / 100 * imageWidth;
      var cropHeight = crop.height / 100 * imageHeight;

      var canvas = document.createElement('canvas');
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      var ctx = canvas.getContext('2d');

      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );
      return canvas.toDataURL('image/jpeg');
    };

    const preview = cropImage(this.state.newPic, this.state.crop);

    this.setState({
      previewImage: preview
    });
  }

  cancelNewPic(event) {
    event.preventDefault();
    this.setState({
      newPic: false
    });
  }

  handleFormSubmit(event) {
    if (this.state.wrongEmail || this.state.userName.length === 0) {
      // Don't submit, there's something wrong with email
      return false;
    } else {
      event.preventDefault();
      this.setState({
        saving: 'Patientez...'
      });
      const updateQuery = database.collection('users').doc(this.state.userId),
        displayName = this.state.userName,
        contactEmail = this.state.userEmail,
        userWeight =
          this.state.userWeight && this.state.userWeight.length > 0
            ? this.state.userWeight
            : false,
        profilePicture = this.state.previewImage
          ? this.state.previewImage
          : this.state.userPic,
        _this = this;

      updateQuery
        .update({
          displayName: displayName,
          contactEmail: contactEmail,
          profilePicture: profilePicture,
          userWeight: userWeight
        })
        .then(function(response) {
          _this.setState({
            saving: 'Modifications enregistrées !'
          });
          setTimeout(function() {
            _this.setState({
              saving: false,
              newPic: false,
              userPic: _this.state.previewImage
                ? _this.state.previewImage
                : _this.state.userPic
            });
          }, 2000);
        })
        .catch(function(error) {
          console.log("That's a FALSE setting saved : " + error.message);
        });
    }
  }

  togglePopin() {
    this.setState({
      deletePopin: !this.state.deletePopin
    });
  }

  render() {
    let previewImage = this.state.previewImage
      ? this.state.previewImage
      : false;

    let visibleImage =
      this.state.userPic !== false ? this.state.userPic : defaultAvatar;
    if (this.state.newPic) {
      visibleImage = previewImage ? previewImage : undefined;
    }

    return (
      <div
        className={this.state.mounted ? 'Settings loaded' : 'Settings'}
        id="Settings">
        <div className="container-fluid page-intro">
          <div className="container">
            <Link to="/">
              <FontAwesomeIcon icon={['fas', 'angle-left']} size="1x" /> Retour
            </Link>
            <h1 className="page-header">Paramètres</h1>
            <div
              className="profilePic"
              style={{ backgroundImage: 'url(' + visibleImage + ')' }}
            />
          </div>
        </div>

        <div className="container setting-contents animation-contents">
          <div id="bar-settings">
            <h3 className="type-title">Gestion de la barre libre</h3>
            <div className="setting-panel" id="barbell">
              <div className="panel-heading">
                <h4 className="title">
                  Poids de la barre à vide
                  {this.state.savingBarbell ? (
                    <i className={this.state.savingBarbell} />
                  ) : (
                    false
                  )}
                </h4>
              </div>
              <form action="#" className="panel-body">
                {this.state.loading ? (
                  <p>Chargement...</p>
                ) : (
                  <div
                    className={
                      this.state.isPressed
                        ? 'barbell-load pressed ' + this.state.direction
                        : 'barbell-load'
                    }>
                    <button
                      className="button"
                      type="button"
                      onMouseUp={this.onMouseUp.bind(this)}
                      onMouseDown={this.onMouseDown.bind(this, 'less')}
                      onTouchEnd={this.onMouseUp.bind(this)}
                      onTouchCancel={this.onMouseUp.bind(this)}
                      onTouchStart={this.onMouseDown.bind(this, 'less')}>
                      <FontAwesomeIcon icon={['fas', 'minus']} size="1x" />
                    </button>
                    <div className="input">
                      <p>kg</p>
                      <input
                        type="number"
                        value={this.state.settings.baseBarbell}
                        onChange={this.updateBarbell}
                      />
                    </div>
                    <button
                      className="button"
                      type="button"
                      onMouseUp={this.onMouseUp.bind(this)}
                      onMouseDown={this.onMouseDown.bind(this, 'more')}
                      onTouchEnd={this.onMouseUp.bind(this)}
                      onTouchCancel={this.onMouseUp.bind(this)}
                      onTouchStart={this.onMouseDown.bind(this, 'more')}>
                      <FontAwesomeIcon icon={['fas', 'plus']} size="1x" />
                    </button>
                  </div>
                )}
              </form>
            </div>

            <div className="setting-panel" id="discs">
              <div className="panel-heading">
                <h4 className="title">
                  Poids libres pour barre
                  {this.state.savingWeights ? (
                    <i className={this.state.savingWeights} />
                  ) : (
                    false
                  )}
                </h4>
              </div>
              {this.state.loading ? (
                <div className="panel-body">
                  <p>Chargement...</p>
                </div>
              ) : (
                <form action="#" className="panel-body weights">
                  <div className="free-weights">
                    <input
                      type="checkbox"
                      name="availableWeights"
                      onChange={this.updateWeights}
                      value="25"
                      id="input-25"
                      checked={
                        this.state.settings.availableWeights.indexOf(25) > -1
                          ? true
                          : false
                      }
                    />{' '}
                    <label htmlFor="input-25">25kg</label>
                  </div>
                  <div className="free-weights">
                    <input
                      type="checkbox"
                      name="availableWeights"
                      onChange={this.updateWeights}
                      value="20"
                      id="input-20"
                      checked={
                        this.state.settings.availableWeights.indexOf(20) > -1
                          ? true
                          : false
                      }
                    />{' '}
                    <label htmlFor="input-20">20kg</label>
                  </div>
                  <div className="free-weights">
                    <input
                      type="checkbox"
                      name="availableWeights"
                      onChange={this.updateWeights}
                      value="15"
                      id="input-15"
                      checked={
                        this.state.settings.availableWeights.indexOf(15) > -1
                          ? true
                          : false
                      }
                    />
                    <label htmlFor="input-15">15kg</label>
                  </div>
                  <div className="free-weights">
                    <input
                      type="checkbox"
                      name="availableWeights"
                      onChange={this.updateWeights}
                      value="10"
                      id="input-10"
                      checked={
                        this.state.settings.availableWeights.indexOf(10) > -1
                          ? true
                          : false
                      }
                    />{' '}
                    <label htmlFor="input-10">10kg</label>
                  </div>
                  <div className="free-weights">
                    <input
                      type="checkbox"
                      name="availableWeights"
                      onChange={this.updateWeights}
                      value="5"
                      id="input-5"
                      checked={
                        this.state.settings.availableWeights.indexOf(5) > -1
                          ? true
                          : false
                      }
                    />{' '}
                    <label htmlFor="input-5">5kg</label>
                  </div>
                  <div className="free-weights">
                    <input
                      type="checkbox"
                      name="availableWeights"
                      onChange={this.updateWeights}
                      value="2.5"
                      id="input-2.5"
                      checked={
                        this.state.settings.availableWeights.indexOf(2.5) > -1
                          ? true
                          : false
                      }
                    />{' '}
                    <label htmlFor="input-2.5">2.5kg</label>
                  </div>
                  <div className="free-weights">
                    <input
                      type="checkbox"
                      name="availableWeights"
                      onChange={this.updateWeights}
                      value="1.25"
                      id="input-1.25"
                      checked={
                        this.state.settings.availableWeights.indexOf(1.25) > -1
                          ? true
                          : false
                      }
                    />{' '}
                    <label htmlFor="input-1.25">1.25kg</label>
                  </div>
                  <div className="free-weights">
                    <input
                      type="checkbox"
                      name="availableWeights"
                      onChange={this.updateWeights}
                      value="1"
                      id="input-1"
                      checked={
                        this.state.settings.availableWeights.indexOf(1) > -1
                          ? true
                          : false
                      }
                    />{' '}
                    <label htmlFor="input-1">1kg</label>
                  </div>
                  <div className="free-weights">
                    <input
                      type="checkbox"
                      name="availableWeights"
                      onChange={this.updateWeights}
                      value="0.5"
                      id="input-0.5"
                      checked={
                        this.state.settings.availableWeights.indexOf(0.5) > -1
                          ? true
                          : false
                      }
                    />{' '}
                    <label htmlFor="input-0.5">0.5kg</label>
                  </div>
                  <div className="free-weights">
                    <input
                      type="checkbox"
                      name="availableWeights"
                      onChange={this.updateWeights}
                      value="0.25"
                      id="input-0.25"
                      checked={
                        this.state.settings.availableWeights.indexOf(0.25) > -1
                          ? true
                          : false
                      }
                    />{' '}
                    <label htmlFor="input-0.25">0.25kg</label>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div id="user-settings">
            <h3 className="type-title">Paramètres utilisateur</h3>
            <div className="setting-panel" id="account">
              <div className="panel-heading">
                <h3 className="title">Paramètres du compte</h3>
              </div>
              {this.state.loading ? (
                <div className="panel-body">
                  <p>Chargement...</p>
                </div>
              ) : (
                <form
                  className="panel-body form no-padding"
                  onSubmit={this.handleFormSubmit}>
                  <div id="profile">
                    <div className="fields">
                      <div className="form-group">
                        <label>Nom</label>
                        <input
                          type="text"
                          className="form-control"
                          name="userName"
                          value={this.state.userName}
                          onChange={this.updateAccount}
                        />
                      </div>
                      <div className="form-group">
                        <label>Email de contact</label>
                        <input
                          type="email"
                          className="form-control"
                          name="userEmail"
                          value={this.state.userEmail}
                          onChange={this.updateAccount}
                        />
                        {this.state.wrongEmail ? (
                          <p>Cet email n'est pas valide</p>
                        ) : (
                          false
                        )}
                      </div>
                      <div className="form-group">
                        <label>Image de profil</label>
                        <span className="fake-button">
                          <input
                            type="file"
                            accept="image/x-png,image/gif,image/jpeg"
                            name="userImage"
                            onChange={this.updateImage}
                          />
                          Sélectionnez une image...
                        </span>
                        {this.state.newPic ? (
                          <div className="previewPic">
                            <hr />
                            <ReactCrop
                              src={this.state.newPic}
                              crop={this.state.crop}
                              onChange={this.handleCrop}
                              onImageLoaded={this.handleDefaultCrop}
                              className="img-responsive"
                            />
                            <button
                              className="btn btn-danger"
                              onClick={this.cancelNewPic.bind(this)}>
                              Annuler
                            </button>
                          </div>
                        ) : (
                          false
                        )}
                      </div>
                      <div className="form-group">
                        <p>
                          Pour avoir une estimation de la dépense calorique de
                          vos séances, entrez ces informations :
                        </p>
                        <label htmlFor="weight">Poids</label>
                        <div className="input-wrapper">
                          <input
                            type="number"
                            id="weight"
                            name="userWeight"
                            onChange={this.updateAccount}
                            value={this.state.userWeight}
                          />
                          <p className="input-legend">kg</p>
                        </div>
                      </div>
                      <div className="buttons">
                        {this.state.saving ? (
                          <InlineLoader copy={this.state.saving} />
                        ) : (
                          <button
                            type="submit"
                            className="btn submit-button"
                            disabled={
                              this.state.wrongEmail ||
                              this.state.userName.length === 0
                                ? true
                                : false
                            }>
                            Valider
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-danger no-border"
                          onClick={this.props.toggleModal.bind(this, {
                            type: 'account'
                          })}>
                          Supprimer ce compte
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
