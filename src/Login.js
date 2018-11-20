import React, { Component } from 'react'
import logo from './Images/Header.jpg'
import { Button, Input} from 'reactstrap'
import * as firebase from 'firebase'
import unLogo from './Images/UN.png'
import './App.css'

class Login extends Component {
    constructor(props){
        super(props)
        
        this.state = {
            email: '',
            password: ''
        }

        this.handleInput=this.handleInput.bind(this)
        this.signIn=this.signIn.bind(this)

    }

    //Iniciar session
    signIn(e){
        e.preventDefault()
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch(function(error){
          alert('Ingrese correo y contraseña correcta')
        })
    }
    
    //Manejo de texto ingresado
    handleInput(e){
        this.setState({
          [e.target.name]: e.target.value
        })
    }

    render(){
        return(
            <div className='App'>
                <div className = "App-header">
                    <img src={logo} alt = '' className = 'Logo'/>
                </div>
                <div className = 'OuterForm'>
                    <div className ='LoginForm'>
                        <div className='LabelBig'>Login Servidor Web</div>
                        <div className='InputFieldEmail'>
                            <div className="LabelLogin">Correo</div>
                            <Input className='InputField' type='email' name='email' onChange={this.handleInput}></Input>
                        </div>

                        <div className='InputFieldPassword'>
                            <div className="LabelLogin">Contraseña</div>
                            <Input className='InputField' type='password' name='password' onChange={this.handleInput}></Input>
                        </div>

                        <div className='SignInButton'>
                            <Button color='success' onClick={this.signIn}>Iniciar sesion</Button>
                        </div>
                    </div>
                </div>
                <div className = "Footer2">
                    <img className='unLogo' src={unLogo} />
                </div>
            </div>
        )
    }
}

export default Login