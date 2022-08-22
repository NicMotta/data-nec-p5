// data_nec v2.0
// Recorridos urbanos
// Nic Motta
// 2022
// Desarrollado en p5.js

let geolocation = [{
  lat: 0,
  lng: 0,
}]
let latitude, longitude, datosGeolocation

let sensors = [{
  gx: 0,
  gy: 0,
  gz: 0,
  ax: 0,
  ay: 0,
  az: 0
}]
let gx, gy, gz, ax, ay, az, datosSensor

let contadorGeolocation = 0
let contadorSensor = 0
let mic, recorder, soundFile
let video;

let estado;

let timer = {
  minutes: 0,
  seconds: 0
}
let minutes, seconds

let estadoRegistro = false
let estadoMensaje = 'No iniciado'

function setup() {
  noCanvas()

  watchPosition(positionChanged)

  video = createCapture(VIDEO)
  video.size(1, 1)

  mic = new p5.AudioIn()
  mic.start()
  recorder = new p5.SoundRecorder()
  recorder.setInput(mic)
  soundFile = new p5.SoundFile()

  setInterval(setSensores, 200)
  setInterval(setTime, 1000)

  estado = select('#status')
  minutes = select('#minutes')
  seconds = select('#seconds')
  latitude = select('#lat')
  longitude = select('#lng')
  datosGeolocation = select('#datogeo')
  gx = select('#gx')
  gy = select('#gy')
  gz = select('#gz')
  ax = select('#ax')
  ay = select('#ay')
  az = select('#az')
  datosSensor = select('#datosensor')
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight)
}

function draw() {
  image(video, 0, 0);

  estado.html(estadoMensaje)
  seconds.html(timer.seconds)
  minutes.html(timer.minutes)
  latitude.html(geolocation[contadorGeolocation].lat)
  longitude.html(geolocation[contadorGeolocation].lng)
  datosGeolocation.html(contadorGeolocation)
  gx.html(sensors[contadorSensor].gx)
  gy.html(sensors[contadorSensor].gy)
  gz.html(sensors[contadorSensor].gz)
  ax.html(sensors[contadorSensor].ax)
  ay.html(sensors[contadorSensor].ay)
  az.html(sensors[contadorSensor].az)
  datosSensor.html(contadorSensor)
}

function positionChanged(position){
  if (estadoRegistro){
    contadorGeolocation
    geolocation[contadorGeolocation] = {
      lat: position.latitude,
      lng: position.longitude,
    }
  }
}

function setRecord() {
  if (mic.enabled && estadoRegistro) {
    getAudioContext().resume()
    recorder.record(soundFile)
    console.log('grabando sonido')
  }
}

function setStop() {
  getAudioContext().resume()
  recorder.stop()
  console.log('deteniendo grabacion')
  //saveSound(soundFile, 'mySound.wav')
}

function setSensores() {
  if (estadoRegistro){
    contadorSensor++
    sensors[contadorSensor] = {
      gx: rotationX.toFixed(1),
      gy: rotationY.toFixed(1),
      gz: rotationZ.toFixed(1),
      ax: accelerationX.toFixed(1),
      ay: accelerationY.toFixed(1),
      az: accelerationZ.toFixed(1),
    }
  }
  // setear html
}

function setTime() {
  if (estadoRegistro) {
    timer.seconds++
    if (timer.seconds > 59) {
      timer.seconds = 0
      timer.minutes++
    }
  }
}

function setStart() {
  estadoRegistro = true
  estadoMensaje = 'Iniciado'
}

function setStop() {
  estadoRegistro = false
  estadoMensaje = 'Detenido'
}

function setDownload() {
  estadoMensaje = 'Descargado'
  getAudioContext().resume()
  saveSound(soundFile, 'mySound.wav')
}

function setClear() {
  estadoMensaje = 'Reset'
  timer.minutes = 0
  timer.seconds = 0
  contadorGeolocation = 0
  contadorSensor = 0
}

