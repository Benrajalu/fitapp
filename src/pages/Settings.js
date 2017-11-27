import React, { Component } from 'react';
import {Redirect} from 'react-router';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactCrop from 'react-image-crop';
import {firebaseAuth, database} from '../utils/fire';

import AccountDeleteModal from '../blocks/AccountDeleteModal';

import userData from '../data/users.json';
import defaultAvatar from '../images/default-avatar.png';

import '../styles/ReactCrop.css';
import '../styles/Settings.css';

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
    this.togglePopin = this.togglePopin.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);

    this.state = {
      user: firebaseAuth.currentUser ? firebaseAuth.currentUser : {uid: "0"}, 
      mounted:false,
      userId:false,
      loading: true,
      userName : '',
      userPic: false,
      userEmail: '',
      crop: {
        aspect:1
      },
      settings: {
        baseBarbell: 0, 
        availableWeights: []
      }, 
      wrongEmail: false,
      previewImage: false,
      animate: " animate"
    }
  }

  userListener(){
    const _this = this, 
          user = this.state.user;

    this.fireUserListener = database.collection('users').doc(user.uid).get().then((doc) => {
      if(doc.exists){
        const userObj = doc.data();
        userObj.uid = user.uid;
        _this.setState({
          loading:false,
          userId: userObj.uid,
          settings: userObj.settings,
          userName : userObj.displayName,
          userPic: userObj.profilePicture,
          userEmail: userObj.contactEmail
        });
      }
    });
  }

  componentWillMount() {
    // Binding the listeners created above to this component
    this.userListener = this.userListener.bind(this);
    this.userListener();
  }

  compontentWillUnmout(){
    // Removing the bindings and stopping the events from poluting the state
    this.userListener = undefined;
  }

  componentDidMount(){
    document.title = "FitApp. - Vos paramètres";
    const _this = this;
    setTimeout(() => {
      _this.setState({
        mounted:true
      });
    }, 200)
  }

  updateWeights(event){
    let target = parseFloat(event.target.value);

    const currentWeights = this.state.settings;
    if(this.state.settings.availableWeights.indexOf(target) !== -1){
      const targetIndex = this.state.settings.availableWeights.indexOf(target);
      currentWeights.availableWeights.splice(targetIndex, 1);
    }
    else{
      currentWeights.availableWeights.push(target);
    }

    this.setState({
      settings: currentWeights,
      savingWeights: "saving"
    }, () => {
      const updateQuery = database.collection('users').doc(this.state.userId), 
            value = this.state.settings.availableWeights, 
            _this = this;

      updateQuery.update({
        "settings.availableWeights" : value
      })
      .then(function(response){
        console.log("Congrats, settings saved !");
        _this.setState({
          savingWeights: 'saved'
        });
        setTimeout(function(){
          _this.setState({
            savingWeights: false
          });
        }, 2000);
      })
      .catch(function(error){
        console.log("That's a FALSE setting saved : " + error.message);
      });
    })
  }

  updateBarbell(event){
    let target = parseFloat(event.target.value);

    const currentSettings = this.state.settings;
    currentSettings.baseBarbell = target === 0 ? 1 : target;


    this.setState({
      settings: currentSettings, 
      savingBarbell: "saving"
    }, () => {
      const updateQuery = database.collection('users').doc(this.state.userId), 
            value = this.state.settings.baseBarbell, 
            _this = this;

      updateQuery.update({
        "settings.baseBarbell" : value
      })
      .then(function(response){
        console.log("Congrats, settings saved !");
        _this.setState({
          savingBarbell: 'saved'
        });
        setTimeout(function(){
          _this.setState({
            savingBarbell: false
          });
        }, 2000);
      })
      .catch(function(error){
        console.log("That's a FALSE setting saved : " + error.message);
      });
    })
  }

  updateAccount(event){
    let updatedField = event.target.name, 
        value = false;
    const stateSnapshot = this.state;

    if(updatedField !== "userImage"){
      value = event.target.value;
      if(updatedField === "userEmail"){
        const regex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        let isValid = regex.test(value);
        if(isValid === false){
          stateSnapshot.wrongEmail = true;
        }
        else{
          stateSnapshot.wrongEmail = false;
        }  
      }
      stateSnapshot[updatedField] = value;
      this.setState(stateSnapshot);
    }
  }

  updateImage(event){
    // Fires when users upload a new profile pic and displays a preview, in a cropper widget
    let reader = new FileReader(), 
        file = event.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        newPic: reader.result
      }) 
    }

    reader.readAsDataURL(file);
  }

  handleCrop(crop, pixelCrop){;
    // Fires when users decide to re-crop their profile pics 
    crop.aspect= 1 / 1;
    this.setState({
      crop: crop
    });
    this.handePreviewImage();
  }

  handleDefaultCrop(image){
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
    
    if(image){
      const defaultCrop = makeAspectCrop({
        x: 25,
        y: 0,
        aspect: 1 / 1,
        width: 50,
      }, image);

      this.setState({
        crop: defaultCrop
      }, () => {
        this.handePreviewImage();
      });
    }
  }

  handePreviewImage(){
    const cropImage = (imgSrc, crop) => {

      var image = new Image();
      image.onload = function(e) {
        image = null;
      };
      image.src = imgSrc;

      var imageWidth = image.naturalWidth;
      var imageHeight = image.naturalHeight;

      var cropX = (crop.x / 100) * imageWidth;
      var cropY = (crop.y / 100) * imageHeight;

      var cropWidth = (crop.width / 100) * imageWidth;
      var cropHeight = (crop.height / 100) * imageHeight;

      var canvas = document.createElement('canvas');
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      var ctx = canvas.getContext('2d');

      ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      return canvas.toDataURL('image/jpeg');
    }

    const preview = cropImage(this.state.newPic, this.state.crop);

    this.setState({
      previewImage: preview
    });
  }

  handleFormSubmit(event){
    if(this.state.wrongEmail || this.state.userName.length === 0){
      // Don't submit, there's something wrong with email
      return false;
    }
    else{
      event.preventDefault();
      this.setState({
        saving: "Patientez..."
      });
      const updateQuery = database.collection('users').doc(this.state.userId),
            displayName = this.state.userName,
            contactEmail = this.state.userEmail, 
            profilePicture = this.state.previewImage ? this.state.previewImage : this.state.userPic, 
            _this = this;

      updateQuery.update({
        displayName : displayName,
        contactEmail : contactEmail,
        profilePicture : profilePicture,
      })
      .then(function(response){
        console.log("Congrats, settings saved !");
        _this.setState({
          saving: "Modifications enregistrées !"
        });
        setTimeout(function(){
          _this.setState({
            saving: false,
            newPic: false, 
            userPic: _this.state.previewImage ? _this.state.previewImage : _this.state.userPic
          });
        }, 2000);
      })
      .catch(function(error){
        console.log("That's a FALSE setting saved : " + error.message);
      });
    }
  }

  togglePopin(){
    this.setState({
      deletePopin: !this.state.deletePopin
    });
  }

  deleteAccount(){
    const userId = userData[0].id;
    const serverPayload = {
      method: 'post', 
      url: '',
      data: {
        removeUser: userId,
      }  
    }, 
    _this = this;

    axios(serverPayload)
      .then(function(response){
        console.log("SADNESS, user has been deleted");
        console.log(response);
        _this.setState({
          disconnecting: true
        })
      })
      .catch(function(error){
        console.log("That's a FALSE user removed : " + error.message);
        console.log(serverPayload);
        _this.setState({
          disconnecting: true
        })
      });
  }

  render() {
    let previewImage = this.state.previewImage ? this.state.previewImage : false;

    return (
      <div className={this.state.mounted ? 'Settings loaded' : 'Settings'} id="Settings">
        <div className="container animation-intro">
          <div className="page-header">
            <Link to="/" title="Retour au dashboard"><i className="fa fa-angle-left"></i></Link>
            <h1>Paramètres</h1>
          </div>
        </div>

        <div className="container setting-contents animation-contents">
          <div className="large-8 medium-7 small-6 columns">
            <h3 className="section-title">Gestion des poids (barbell)</h3>

            <div className="weight-settings">
              <div className="panel setting-panel">
                <div className="panel-heading">
                  <h3 className="title">Poids de la barre à vide {this.state.savingBarbell ? <i className={this.state.savingBarbell}></i> : false}</h3>
                </div>
                <form action="#" className="panel-body">
                { this.state.loading ? 
                  <p>Chargement...</p> 
                  : 
                  <div className="barbell-load">
                    <input type="number" value={this.state.settings.baseBarbell} onChange={this.updateBarbell}/> kg
                  </div>
                }
                </form>
              </div>

              <div className="panel setting-panel">
                <div className="panel-heading">
                  <h3 className="title">Poids libres disponibles {this.state.savingWeights ? <i className={this.state.savingWeights}></i> : false}</h3>
                </div>
                { this.state.loading ? 
                  <div className="panel-body">
                    <p>Chargement...</p>
                  </div>
                  :
                  <form action="#" className="panel-body">
                    <div className="free-weights"><input type="checkbox" name="availableWeights" onChange={this.updateWeights} value="25" id="input-25" checked={this.state.settings.availableWeights.indexOf(25) > -1 ? true : false} /> <label htmlFor="input-25">25kg</label></div>
                    <div className="free-weights"><input type="checkbox" name="availableWeights" onChange={this.updateWeights} value="20" id="input-20" checked={this.state.settings.availableWeights.indexOf(20) > -1 ? true : false} /> <label htmlFor="input-20">20kg</label></div>
                    <div className="free-weights"><input type="checkbox" name="availableWeights" onChange={this.updateWeights} value="15" id="input-15" checked={this.state.settings.availableWeights.indexOf(15) > -1 ? true : false} /><label htmlFor="input-15">15kg</label></div>
                    <div className="free-weights"><input type="checkbox" name="availableWeights" onChange={this.updateWeights} value="10" id="input-10" checked={this.state.settings.availableWeights.indexOf(10) > -1 ? true : false} /> <label htmlFor="input-10">10kg</label></div>
                    <div className="free-weights"><input type="checkbox" name="availableWeights" onChange={this.updateWeights} value="5" id="input-5" checked={this.state.settings.availableWeights.indexOf(5) > -1 ? true : false} /> <label htmlFor="input-5">5kg</label></div>
                    <div className="free-weights"><input type="checkbox" name="availableWeights" onChange={this.updateWeights} value="2.5" id="input-2.5" checked={this.state.settings.availableWeights.indexOf(2.5) > -1 ? true : false} /> <label htmlFor="input-2.5">2.5kg</label></div>
                    <div className="free-weights"><input type="checkbox" name="availableWeights" onChange={this.updateWeights} value="1.25" id="input-1.25" checked={this.state.settings.availableWeights.indexOf(1.25) > -1 ? true : false} /> <label htmlFor="input-1.25">1.25kg</label></div>
                    <div className="free-weights"><input type="checkbox" name="availableWeights" onChange={this.updateWeights} value="1" id="input-1" checked={this.state.settings.availableWeights.indexOf(1) > -1 ? true : false} /> <label htmlFor="input-1">1kg</label></div>
                    <div className="free-weights"><input type="checkbox" name="availableWeights" onChange={this.updateWeights} value="0.5" id="input-0.5" checked={this.state.settings.availableWeights.indexOf(0.5) > -1 ? true : false} /> <label htmlFor="input-0.5">0.5kg</label></div>
                    <div className="free-weights"><input type="checkbox" name="availableWeights" onChange={this.updateWeights} value="0.25" id="input-0.25" checked={this.state.settings.availableWeights.indexOf(0.25) > -1 ? true : false} /> <label htmlFor="input-0.25">0.25kg</label></div>
                  </form>
                }
              </div>
            </div>
          </div>

          <div className="large-4 medium-5 small-6 columns">
            <h3 className="section-title">Gestion utilisateur</h3>
            <div className="panel setting-panel">
              <div className="panel-heading">
                <h3 className="title">Paramètres du compte</h3>
              </div>
              { this.state.loading ? 
                <div className="panel-body">
                  <p>Chargement...</p>
                </div>
                :
                <form className="panel-body form" onSubmit={this.handleFormSubmit}>
                  { this.state.newPic ? 
                     <img src={previewImage} alt="" className="img-circle" />
                    :
                    <img src={this.state.userPic !== false ? this.state.userPic : defaultAvatar} alt={this.state.userName} className="img-circle  img-responsive"/>
                  }
                  <div className="form-group">
                    <label>Nom</label>
                    <input type="text" className="form-control" name="userName" value={this.state.userName} onChange={this.updateAccount}/>
                  </div>
                  <div className="form-group">
                    <label>Email de contact</label>
                    <input type="email" className="form-control" name="userEmail" value={this.state.userEmail} onChange={this.updateAccount}/>
                    {this.state.wrongEmail ? <p>Cet email n'est pas valide</p> : false}
                  </div>
                  <div className="form-group">
                    <label>Image de profil</label>
                    <input type="file" accept="image/x-png,image/gif,image/jpeg" name="userImage" onChange={this.updateImage} />
                    { this.state.newPic ? 
                      <div>
                        <hr/>
                        <ReactCrop src={this.state.newPic} crop={this.state.crop} onChange={this.handleCrop} onImageLoaded={this.handleDefaultCrop} className="img-responsive" />
                      </div>
                      : false }
                  </div>
                  <div className="buttons">
                    {this.state.saving ? 
                      <button type="submit" className="btn btn-block btn-big w-radius btn-success" disabled="true">{this.state.saving}</button>
                      :
                      <button type="submit" className="btn btn-block btn-big w-radius btn-green" disabled={this.state.wrongEmail ||  this.state.userName.length === 0 ? true : false}>Valider</button>
                    }
                    <button type="button" className="btn btn-danger" onClick={this.togglePopin}>Supprimer ce compte</button>
                  </div>
                </form>
              }
              {this.state.deletePopin ? 
                <AccountDeleteModal 
                  shouldAppear={this.state.deletePopin ? 'visible' : 'hidden'} 
                  deleteAccount={this.deleteAccount}
                  modalCloser={this.togglePopin} />
                :
                false
              }
            </div>
          </div>
        </div>
        {this.state.disconnecting ? <Redirect push to={{ pathname:'/disconnect' }} /> : false}
      </div>
    )
  }
}

export default Settings;
