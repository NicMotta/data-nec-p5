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

let estado
let SensorsCSV, GeolocationCSV

let timer = {
  minutes: 0,
  seconds: 0
}
let minutes, seconds
let fileDate

let estadoRegistro = false
let estadoMensaje = 'No iniciado'
let estadoAudio = 0;

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

  SensorsCSV = new p5.Table();
  GeolocationCSV = new p5.Table();

  fileDate = day() + '-' + month() + '-' + year()

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

  if (mic.enabled && estadoAudio == 1) {
    getAudioContext().resume()
    recorder.record(soundFile)
  }
  else if (estadoAudio == 2) {
    recorder.stop()
    estadoAudio++
  }

}

function positionChanged(position){
  if (estadoRegistro){
    contadorGeolocation++
    geolocation[contadorGeolocation] = {
      lat: position.latitude,
      lng: position.longitude,
    }
  }
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
  estadoAudio = 1
}

function setStop() {
  estadoRegistro = false
  estadoMensaje = 'Detenido'
  estadoAudio = 2
}

function setDownload() {
  estadoMensaje = 'Descargado'
  getAudioContext().resume()
  // downloadSensors()
  // downloadGeolocation()
  saveSound(soundFile, 'sonido' + fileDate + '.wav')
}

function setClear() {
  estadoMensaje = 'Reset'
  timer.minutes = 0
  timer.seconds = 0
  contadorGeolocation = 0
  contadorSensor = 0
  estadoAudio = 0
}

function downloadSensors(){

  SensorsCSV.addColumn('gx')
  SensorsCSV.addColumn('gy')
  SensorsCSV.addColumn('gz')
  SensorsCSV.addColumn('ax')
  SensorsCSV.addColumn('ay')
  SensorsCSV.addColumn('az')

  sensors.map((element) => {
    let newRow = SensorsCSV.addRow()
    newRow.setNum('gx', element.gx)
    newRow.setNum('gy', element.gy)
    newRow.setNum('gz', element.gz)
    newRow.setNum('ax', element.ax)
    newRow.setNum('ay', element.ay)
    newRow.setNum('az', element.az)
  })

  saveTable(SensorsCSV, 'sensors-' + fileDate + ".csv")
}

function downloadGeolocation(){

  GeolocationCSV.addColumn('lat')
  GeolocationCSV.addColumn('lng')

  geolocation.map((element) => {
    let newRow = GeolocationCSV.addRow()
    newRow.setNum('lat', element.lat)
    newRow.setNum('lng', element.lng)
  })

  saveTable(GeolocationCSV, 'geolocation-' + fileDate + ".csv")
}
