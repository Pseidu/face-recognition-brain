import React, { Component } from 'react';
import ParticlesBg from 'particles-bg';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css';

const initialState = {
  input: '',
  imgUrl: '',
  box: {},
  route: 'signin', // possible values: signin, register, home
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

/******************************************************************************************* */
class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }
  
  loadUser = (data => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  })

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    console.log('La constante clarifaiFace: ', clarifaiFace);
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({ box: box });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onPictureSubmit = () => {
    this.setState({ imgUrl: this.state.input })
    fetch('https://face-recognition-backend-7tak.onrender.com/imageurl', {
              method: 'post',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({input: this.state.input})
      })
      .then(response => response.json())
      .then(result => {
        fetch('https://face-recognition-backend-7tak.onrender.com/image', {
              method: 'put',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: this.state.user.id
              })
            })
          .then(response => response.json())
          .then(userInfo => {
            this.setState(Object.assign(this.state.user, {entries:userInfo.entries}))
          })
          .catch(console.log);
          
        this.displayFaceBox(this.calculateFaceLocation(result));
      })
      .catch(error => console.log('error:', error));
  }

  onRouteChange = (route) => {
    if (route === 'home') {
      this.setState({isSignedIn: true})
    } else {
      this.setState(initialState)
    }
    this.setState({route: route})
  }

  render() {
    return (
      <div className="App">
        <ParticlesBg type="circle" bg={true} />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn} />
        {
          this.state.route === 'home' 
          ? <div>
              <Logo />
              <Rank userName={this.state.user.name} userEntries={this.state.user.entries} />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onPictureSubmit={this.onPictureSubmit}
              />
              <FaceRecognition box={this.state.box} imageUrl={this.state.imgUrl} />
            </div> 
          : (this.state.route === 'signin'
             ? <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
             : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
            ) 
        }
      </div>
    );
  }
}

export default App;