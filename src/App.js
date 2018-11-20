import React, { Component } from 'react'
import * as firebase from 'firebase'
import Home from './Home'
import Login from './Login'

 var config = {
    apiKey: "AIzaSyCQSHU4GscYcdDYiG0TZPTRlrKPcE7HfPo",
    authDomain: "ecocampusar-3dacc.firebaseapp.com",
    databaseURL: "https://ecocampusar-3dacc.firebaseio.com",
    projectId: "ecocampusar-3dacc",
    storageBucket: "ecocampusar-3dacc.appspot.com",
    messagingSenderId: "182100690660"
  }

firebase.initializeApp(config)

class App extends Component {
  
  constructor(props){
    super(props)
    
    this.state = {
      user: {}
    }
  }

  //Se obtiene el estado de autenticación de el usuario
  authListener(){
    firebase.auth().onAuthStateChanged((user)=>{
      if(user){
        this.setState({user});
      } else {
        this.setState({user: null})
      }
    })
  }

  //Correr la función
  componentDidMount() {
    this.authListener()
  }


  render() {
    return (
      <div>
        { //Si hay un usuario logeado entonces se va a home, sino se va a la pantalla de login
    			this.state.user ?
    				<Home />
    			:
            <Login />
    		}
      </div>
    )
  }
}

export default App
