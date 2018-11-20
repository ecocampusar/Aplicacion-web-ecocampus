import React, { Component } from 'react'
import logo from './Images/Header.jpg'
import unLogo from './Images/UN.png'
import './App.css'
import { Button, Table, Progress, Label, Input} from 'reactstrap'
import Modal from 'react-responsive-modal'
import * as firebase from 'firebase'

//Funcion para el filtrado de datos
function searchingFor(sText) {
  return function(x){
    return x.nombre.toLowerCase().includes(sText.toLowerCase()) ||
    x.text.toLowerCase().includes(sText.toLowerCase()) || false
  }
}

class Home extends Component {
  
  constructor(props){
    super(props)
    
    this.state = {
      id:             '',
      idsArray:       [],
      nombre:         '',
      model:          '',
      text:           '',
      song:           '',
      file:           null,
      file2:          null,
      file3:          null,
      editView:       false,
      audioView:      false,
      modelView:      false,
      moreView:       false,
      audioCompleted: 0,
      modelCompleted: 0,
      imageCompleted: 0,
      modelUrl:       '',
      audioUrl:       '',
      imgUrl:         '',
      treeLongText:   '',
      sText:          ''
    }
    
    this.handleUpdateItems=this.handleUpdateItems.bind(this)
    this.handleInput=this.handleInput.bind(this)
    this.handleChange=this.handleChangeAudio.bind(this)
    //this.handleChange=this.handleChangeModel.bind(this)
    this.handleChange=this.handleChangeImage.bind(this)
    //this.handleUpdload=this.handleUpdloadModel.bind(this)
    this.handleUpdload=this.handleUpdloadAudio.bind(this)
    this.handleUpdload=this.handleUpdloadImage.bind(this)
    this.signOut=this.signOut.bind(this)
  }
  
  //Obtener el id del elemento seleccionado de la tabla
  getTableId=(idn)=>{
    this.setState({id: idn})
    this.setState({editView: true})
  }
  
  //Abrir vista de audio
  modalViewOn(name){
    if(name === "Audios")this.setState({audioView: true})
  }

  //Cierra las ventanas de edicion, audio y info
  modalViewClose(name){
    if(name === "Form"){
      this.setState({editView: false})
      //this.setState({modelCompleted:0})
      this.setState({imageCompleted:0})
      this.setState({audioCompleted:0})
    }
    if(name === "Audios")this.setState({audioView: false})
    if(name === "TextoeImagen")this.setState({moreView: false})
  }
  
  //Abre la ventana de info
  moreViewOn(imgurl, text){
    this.setState({imgUrl:imgurl})
    this.setState({treeLongText:text})
    this.setState({moreView: true})
  }
  
  //Obtener el link de descarga del storage en firebase
  getLink=(stateName, stateq, path)=>{
    let { state } = this
    const storage = firebase.storage().ref(path)
    storage.child(stateName).getDownloadURL().then((url)=>{
      state[stateq] = url
      this.setState(state)
      this.modalViewOn(path)
    })
  }
  

  //Sube los elementos a la base de datos
  handleUpdateItems=()=> {
    var ref = firebase.database().ref('/Ids/'+this.state.id)
    if(this.state.nombre !== ''){ ref.update({nombre: this.state.nombre}) }
    //if(this.state.model !== ''){ ref.update({model: this.state.model}) }
    if(this.state.text !== ''){ ref.update({text: this.state.text}) }
    if(this.state.song !== ''){ ref.update({audio: this.state.song}) }
    if(this.state.modelUrl !== ''){ ref.update({modelUrl: this.state.modelUrl}) }
    if(this.state.audioUrl !== ''){ ref.update({audioUrl: this.state.audioUrl}) }
    if(this.state.imgUrl !== ''){ ref.update({imgUrl: this.state.imgUrl}) }
    if(this.state.treeLongText !== ''){ ref.update({treeLongText: this.state.treeLongText}) }
    this.setState({editView : false})
    this.setState({imageCompleted:0})
    this.setState({audioCompleted:0})
  }
  
  //Manejo de ingreso de texto
  handleInput(e){
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  //Manejo de ingreso de modelos
  handleChangeModel = e => {
    if(e.target.files[0]){
      const file = e.target.files[0]
      this.setState(()=>({file}))
      this.setState({modelCompleted:0})
    }
  }

  //Manejo de ingreso de imagenes
  handleChangeImage = e => {
    if(e.target.files[0]){
      const file3 = e.target.files[0]
      this.setState(()=>({file3}))
      this.setState({imageCompleted:0})
    }
  }
  
  //Cerrar sesion
  signOut(){
    firebase.auth().signOut()
  }

  //Manejo de ingreso del audio
  handleChangeAudio = e => {
    if(e.target.files[0]){
      const file2 = e.target.files[0]
      this.setState(()=>({file2}))
      this.setState({audioCompleted:0})
    }
  }

  //Subir modelo
  handleUpdloadModel = (path, progressBar, stateName) => {
    let { state } = this
    if(this.state.file != null) {
      const storage = firebase.storage()
      const file = this.state.file
      const uploadTask = storage.ref(`Modelos/${file.name}`).put(file)
      uploadTask.on('state_changed',
      (snapshot)=>{
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        state["modelCompleted"] = progress
        this.setState(state)
      },
      (error)=>{
        console.log(error)
      }, ()=>{
        storage.ref('Modelos').child(file.name).getDownloadURL().then(url=>{
          state["modelUrl"] = url
          this.setState(state)
        })
        state["model"] = file.name
        this.setState(state)
      })
    } else {
      alert('No ha seleccionado ningun modelo')
    }
  }

  //Subir imagen
  handleUpdloadImage = () => {
    let { state } = this
    if(this.state.file3 != null) {
      const storage = firebase.storage()
      const file3 = this.state.file3
      const uploadTask = storage.ref(`Imagenes/${file3.name}`).put(file3)
      uploadTask.on('state_changed',
      (snapshot)=>{
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log('Upload is ' + progress + '% done')
        state["imageCompleted"] = progress
        this.setState(state)
      },
      (error)=>{
        
      }, ()=>{
        storage.ref('Imagenes').child(file3.name).getDownloadURL().then(url=>{
          state["imgUrl"] = url
          this.setState(state)
        })
      })
    } else {
      alert('No ha seleccionado ninguna imagen')
    }
  }
  
  //Subir audio
  handleUpdloadAudio = () => {
    let { state } = this
    if(this.state.file2 != null) {
      const storage = firebase.storage()
      const file2 = this.state.file2
      const uploadTask = storage.ref(`Audios/${file2.name}`).put(file2)
      uploadTask.on('state_changed',
      (snapshot)=>{
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log('Upload is ' + progress + '% done')
        state["audioCompleted"] = progress
          this.setState(state)
      },
      (error)=>{
        
      }, ()=>{
        storage.ref('Audios').child(file2.name).getDownloadURL().then(url=>{
        state["audioUrl"] = url
        this.setState(state)
      })
        state["song"] = file2.name
        this.setState(state)
        console.log(this.state.song)
      })
    } else {
      alert('No ha seleccionado ningun audio')
    }
  }
  
  //Se obtienen la lista de la database
  componentDidMount() {
    var refid = firebase.database().ref('/Ids/')
    refid.on('value', (snapshot) => {
      let datos = snapshot.val()
      
			let ids = []
			for (var x in datos) {
				ids.push(Object.assign({ key: x }, datos[x]))
			}
			this.setState({ idsArray: ids })
		})
  }
  
  render() {
    return (
      <div className="App">
      <div className = "App-header">
        <img src={logo} alt = '' className = 'Logo'/>
        <Button color="success" className="SignOut" onClick={this.signOut}>Cerrar sesion</Button>
      </div>
      <div className = "TableContainer">  
        <Table responsive striped className='Table'>
          <thead>
          <th className='TableHead' colSpan="6">
            <div  className='SearchInput' >
                <Input placeholder='Buscar' type='text' name='sText' onChange={this.handleInput} value = {this.state.sText}></Input>
            </div>
          </th>
          </thead>
          <thead className='TableHead'>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Texto</th>
              <th>Audio</th>
              <th ></th>
              <th ></th>
            </tr>
          </thead>
          <tbody className='TableBody'>
          {
            this.state.idsArray.filter(searchingFor(this.state.sText)).map((dato) =>{
            return<tr id={dato.key} key={dato.key}>
              <td>{dato.id}</td>
              <td>{dato.nombre}</td>
              <td>{dato.text}</td>
              <td className='ButtonTabl1'><Button outline color="info" onClick={() => this.getLink(dato.audio, 'audioUrl', 'Audios')}>{dato.audio}</Button></td>
              <td className='ButtonTable'><Button outline color="info" onClick={() => this.moreViewOn(dato.imgUrl, dato.treeLongText)}>Info</Button></td>
              <td className='ButtonTable'><Button variant="contained" color="success" onClick={() => this.getTableId(dato.key)}>Editar</Button></td>
            </tr>
            })
           }
          </tbody>
        </Table>
        </div>
        <Modal open={this.state.editView} onClose={()=>this.modalViewClose("Form")} center>
          <div className ="Form">
            <div className="Label">ID # {this.state.id}</div>
            <Input placeholder="Nombre" name="nombre" id="nombre" onChange={this.handleInput}/>
            <div className='Ext'>
              <Label>Imagen</Label>
              <div className='Upload'>
                <Input className='FileInput' type='file' onChange={this.handleChangeImage} />
                <Button className='ButtonL' color="success" onClick={this.handleUpdloadImage}>Subir</Button>
              </div>
              <Progress animated color="success" value={this.state.imageCompleted} />
            </div>
           {/*
            <div className='Ext'>
              <Label>Modelo</Label>
              <div className='Upload'>
                <Input className='FileInput' type='file' onChange={this.handleChangeModel} />
                <Button className='ButtonL' color="success" onClick={this.handleUpdloadModel}>Subir</Button>
              </div>
              <Progress animated color="success" value={this.state.modelCompleted} />
            </div>
           */}
            <div className='Ttext'>
              <Label>Texto</Label>
              <textarea type="text" name="text" id="text" onChange={this.handleInput} />
            </div>
            <div className='Ttext'>
              <Label>Texto ver más</Label>
              <textarea type="text" name="treeLongText" id="treeLongText" onChange={this.handleInput} />
            </div>
            <div className='Ext'>
              <Label>Audio</Label>
              <div className='Upload'>
                <Input className='FileInput' type='file' onChange={this.handleChangeAudio} />
                <Button className='ButtonL' color="success" onClick={this.handleUpdloadAudio}>Subir</Button>
              </div>
              <Progress animated color="success" value={this.state.audioCompleted} />
            </div>
            <Button className='SaveButton' color="success" value="Submit" onClick={this.handleUpdateItems}>Guardar</Button>
          </div>
        </Modal>
        <Modal open={this.state.audioView} onClose={()=>this.modalViewClose("Audios")} center>
          <div className ="AudioForm">
            <audio controls>
              <source src={this.state.audioUrl} type="audio/mpeg" />
            </audio>
          </div>
        </Modal>
        <Modal open = {this.state.moreView} onClose={()=>this.modalViewClose("TextoeImagen")} center>
          <div className='More'>
            <Label>Imagen del arbol</Label>
            <br/>
            <img className="TreeImage" src={this.state.imgUrl} alt =''/>
            <br/>
            <Label>Texto de ver más</Label>
            <br/>
            <div>{this.state.treeLongText}</div>
          </div>
        </Modal>
        <div className = "Footer">
           <img className='unLogo' src={unLogo} />
        </div>
      </div>
    )
  }
}

export default Home
