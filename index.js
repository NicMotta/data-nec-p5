// data_nec v2.0
// Recorridos urbanos
// Nic Motta
// 2022
// Desarrollado en p5.js

let geolocation = [{
  lat: 0,
  lng: 0,
}]

let sensors = [{
  gx: 0,
  gy: 0,
  gz: 0,
  ax: 0,
  ay: 0,
  az: 0
}]

let contadorGeolocation = 0
let contadorSensor = 0
let buttonrec, buttonstop, buttondownload, buttonvideo
let mic, recorder, soundFile
let video;

let timer = {
  minutes: 0,
  seconds: 0
}

let estadoRegistro = true

function setup() {
  noCanvas()
  // createCanvas(window.innerWidth, window.innerHeight)

  watchPosition(positionChanged)

  buttonrec = createButton('rec')
  buttonrec.position(100, 100)
  buttonrec.mousePressed(setRecord)

  buttonstop = createButton('stop')
  buttonstop.position(100, 150)
  buttonstop.mousePressed(setStop)

  buttonstop = createButton('download')
  buttonstop.position(100, 200)
  buttonstop.mousePressed(setDownload)

  video = createCapture(VIDEO); //access live webcam
  video.size(320, 240); //change the size to 320 x 240
  buttonvideo = createButton('snap'); //create a button called "snap"
  buttonvideo.position(100, 250)
  buttonvideo.mousePressed(takesnap); //when the button is pressed, call the function called "takesnap"

  mic = new p5.AudioIn();
  mic.start();
  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);
  soundFile = new p5.SoundFile();

  setInterval(setSensores, 200);
  setInterval(setTime, 1000)
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight)
}

function draw() {
  background(210)
  fill(255,0,0)
  ellipseMode(CENTER)
  ellipse(width/2, height/2, 50, 50)
  textSize(32)
  

  image(video, 0, 300);


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

function takesnap() {
  image(video, 0, 300); //draw the image being captured on webcam onto the canvas at the position (0, 0) of the canvas
}

function holaMundo() {
  console.log('hola mundo')
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

function setStart() {
  estadoRegistro = true
}

function setStop() {
  estadoRegistro = false
}

function setDownload() {
  getAudioContext().resume()
  saveSound(soundFile, 'mySound.wav')
}

function setTime() {
  if (estadoRegistro) {
    timer.seconds++
    if (timer.seconds > 59) {
      timer.seconds = 0
      timer.minutes++
    }
  }
  // setear el html con los valores
}