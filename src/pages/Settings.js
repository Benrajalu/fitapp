import React, { Component } from 'react';
import axios from 'axios';
import ReactCrop from 'react-image-crop';

import userData from '../data/users.json';
import defaultAvatar from '../images/default-avatar.png';

import '../styles/ReactCrop.css';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.updateWeights = this.updateWeights.bind(this);
    this.updateBarbell = this.updateBarbell.bind(this);
    this.updateAccount = this.updateAccount.bind(this);
    this.updateImage = this.updateImage.bind(this);
    this.handleCrop = this.handleCrop.bind(this);
    this.handleDefaultCrop = this.handleDefaultCrop.bind(this);
    this.state = {
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
      wrongEmail: false
    }
  }

  componentDidMount() {
    this.setState({
      settings: userData[0].settings,
      userName : userData[0]["display-name"],
      userPic: userData[0]["profile-picture"],
      userEmail: userData[0]["contact-email"]
    })
  }

  updateWeights(event){
    let target = parseFloat(event.target.value), 
        serverPayload = {
          method: 'post', 
          url: '',
          data: {
            settings: {}
          }  
        };

    const currentWeights = this.state.settings;
    if(this.state.settings.availableWeights.indexOf(target) !== -1){
      const targetIndex = this.state.settings.availableWeights.indexOf(target);
      currentWeights.availableWeights.splice(targetIndex, 1);
    }
    else{
      currentWeights.availableWeights.push(target);
    }

    this.setState({
      settings: currentWeights
    }, () => {
      serverPayload.data.settings.availableWeights = this.state.settings.availableWeights;
      axios(serverPayload)
      .then(function(response){
        console.log("Congrats, settings saved !");
        console.log(response);
      })
      .catch(function(error){
        console.log("That's a FALSE setting saved : " + error.message);
        console.log(serverPayload);
      })
    })
  }

  updateBarbell(event){
    let target = parseFloat(event.target.value), 
        serverPayload = {
          method: 'post', 
          url: '',
          data: {
            settings: {}
          }  
        };

    const currentSettings = this.state.settings;
    currentSettings.baseBarbell = target === 0 ? 1 : target;


    this.setState({
      settings: currentSettings
    }, () => {
      serverPayload.data.settings.baseBarbell = this.state.settings.baseBarbell;

      axios(serverPayload)
      .then(function(response){
        console.log("Congrats, settings saved !");
        console.log(response);
      })
      .catch(function(error){
        console.log("That's a FALSE setting saved : " + error.message);
        console.log(serverPayload);
      })
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
        console.log(isValid);
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
    console.log(this.state);
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
    console.log(crop);
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
      });
    }
  }

  render() {
    return (
      <div className="Settings">
        <div className="container">
          <div className="page-header">
            <h1>Paramètres</h1>
          </div>
        </div>

        <div className="container">
          <div className="col-md-8">
            <h3>Gestion des poids (barbell)</h3>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Poids de la barre à vide</h3>
              </div>
              <form action="#" className="panel-body">
                <input type="number" value={this.state.settings.baseBarbell} onChange={this.updateBarbell}/> kg
              </form>
            </div>

            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Poids libres disponibles</h3>
              </div>
              <form action="#" className="panel-body">
                <div><input type="checkbox" name="availableWeights" onChange={this.updateWeights} value="25" id="input-25" checked={this.state.settings.availableWeights.indexOf(25) > -1 ? true : false} /> <label htmlFor="input-25">25kg</label></div>
                <div><input type="checkbox" name="availableWeights" onChange={this.updateWeights} value="20" id="input-20" checked={this.state.settings.availableWeights.indexOf(20) > -1 ? true : false} /> <label htmlFor="input-20">20kg</label></div>
                <div><input type="checkbox" name="availableWeights" onChange={this.updateWeights} value="15" id="input-15" checked={this.state.settings.availableWeights.indexOf(15) > -1 ? true : false} /><label htmlFor="input-15">15kg</label></div>
                <div><input type="checkbox" name="availableWeights" onChange={this.updateWeights} value="10" id="input-10" checked={this.state.settings.availableWeights.indexOf(10) > -1 ? true : false} /> <label htmlFor="input-10">10kg</label></div>
                <div><input type="checkbox" name="availableWeights" onChange={this.updateWeights} value="5" id="input-5" checked={this.state.settings.availableWeights.indexOf(5) > -1 ? true : false} /> <label htmlFor="input-5">5kg</label></div>
                <div><input type="checkbox" name="availableWeights" onChange={this.updateWeights} value="2.5" id="input-2.5" checked={this.state.settings.availableWeights.indexOf(2.5) > -1 ? true : false} /> <label htmlFor="input-2.5">2.5kg</label></div>
                <div><input type="checkbox" name="availableWeights" onChange={this.updateWeights} value="1.25" id="input-1.25" checked={this.state.settings.availableWeights.indexOf(1.25) > -1 ? true : false} /> <label htmlFor="input-1.25">1.25kg</label></div>
                <div><input type="checkbox" name="availableWeights" onChange={this.updateWeights} value="1" id="input-1" checked={this.state.settings.availableWeights.indexOf(1) > -1 ? true : false} /> <label htmlFor="input-1">1kg</label></div>
                <div><input type="checkbox" name="availableWeights" onChange={this.updateWeights} value="0.5" id="input-0.5" checked={this.state.settings.availableWeights.indexOf(0.5) > -1 ? true : false} /> <label htmlFor="input-0.5">0.5kg</label></div>
                <div><input type="checkbox" name="availableWeights" onChange={this.updateWeights} value="0.25" id="input-0.25" checked={this.state.settings.availableWeights.indexOf(0.25) > -1 ? true : false} /> <label htmlFor="input-0.25">0.25kg</label></div>
              </form>
            </div>
          </div>

          <div className="col-md-4">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Paramètres du compte</h3>
              </div>
              <form className="panel-body form">
                { this.state.newPic ? 
                  <ReactCrop src={this.state.newPic} crop={this.state.crop} onChange={this.handleCrop} onImageLoaded={this.handleDefaultCrop} className="img-responsive" />
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
                  <input type="file" name="userImage" onChange={this.updateImage} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={this.state.wrongEmail ? true : false}>Valider</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Settings;
