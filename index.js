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
let sensorsCSV, geolocationCSV

let timer = {
  minutes: 0,
  seconds: 0
}
let minutes, seconds
let fileDate
let dateStart, dateStop

let estadoRegistro = false
let estadoMensaje = 'No iniciado'
let estadoAudio = 0;

// -----------------
let myMap
let canvas
let mappa = new Mappa('Leaflet')
let data

let options = {
  lat: -34.439953,
  lng: -58.559640,
  zoom: 16,
  style: "https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png"
}
// -----------------



function setup() {
  noCanvas()
  // canvas = createCanvas(window.Width, 280)
  // canvas.style('display', 'block');
  // canvas.parent('#div')

  watchPosition(positionChanged)

  video = createCapture(VIDEO)
  video.size(1, 1)

  sensorsCSV = new p5.Table()
  geolocationCSV = new p5.Table()
  dateCSV = new p5.Table()

  fileDate = day() + '-' + month() + '-' + year() + '-' + hour() + '-' + minute()

  setInterval(setSensores, 100)
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

  // myMap = mappa.tileMap(options)
  // myMap.overlay(canvas)
  // myMap.onChange(callbackFunction)
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
  dateStart = day() + '-' + month() + '-' + year() + ' ' + hour() + ':' + minute()
}

function setStop() {
  estadoRegistro = false
  estadoMensaje = 'Detenido'
  dateStop = day() + '-' + month() + '-' + year() + ' ' + hour() + ':' + minute()
}

function setDownload() {
  estadoMensaje = 'Descargado'
  downloadSensors()
  downloadGeolocation()
  downloadDate()
}

function setClear() {
  estadoMensaje = 'Reset'

  timer[{
    minutes: 0,
    seconds: 0,
  }]

  geolocation[{
    lat: 0,
    lng: 0
  }]

  sensors = [{
    gx: 0,
    gy: 0,
    gz: 0,
    ax: 0,
    ay: 0,
    az: 0
  }]

  contadorGeolocation = 0
  contadorSensor = 0
}

function downloadSensors(){
  sensorsCSV.addColumn('gx')
  sensorsCSV.addColumn('gy')
  sensorsCSV.addColumn('gz')
  sensorsCSV.addColumn('ax')
  sensorsCSV.addColumn('ay')
  sensorsCSV.addColumn('az')

  sensors.map((element) => {
    let newRow = sensorsCSV.addRow()
    newRow.setNum('gx', element.gx)
    newRow.setNum('gy', element.gy)
    newRow.setNum('gz', element.gz)
    newRow.setNum('ax', element.ax)
    newRow.setNum('ay', element.ay)
    newRow.setNum('az', element.az)
  })

  saveTable(sensorsCSV, 'sensors-' + fileDate + ".csv")
}

function downloadGeolocation(){
  geolocationCSV.addColumn('lat')
  geolocationCSV.addColumn('lng')

  geolocation.map((element) => {
    let newRow = geolocationCSV.addRow()
    newRow.setNum('lat', element.lat)
    newRow.setNum('lng', element.lng)
  })

  saveTable(geolocationCSV, 'geolocation-' + fileDate + ".csv")
}

function downloadDate() {
  const duration = timer.minutes + ':' + timer.seconds

  createStringDict({
    dateStart: dateStart,
    dateStop: dateStop,
    totalDuration: duration,
    totalSensors: contadorSensor,
    totalGeolocation: contadorGeolocation,
  }).saveTable('data-' + fileDate + '.csv');


  // dateCSV.addColumn('dateStart')
  // dateCSV.addColumn('dateStop')
  // dateCSV.addColumn('totalDuration')
  // dateCSV.addColumn('totalSensors')
  // dateCSV.addColumn('totalGeolocation')

  // let newRow = geolocationCSV.addRow()
  // newRow.setNum('dateStart', dateStart)
  // newRow.setNum('dateStop', dateStop)
  // newRow.setNum('totalDuration', duration)
  // newRow.setNum('totalSensors', contadorSensor)
  // newRow.setNum('totalGeolocation', contadorGeolocation)

  // saveTable(dateCSV, 'data-' + fileDate + '.csv')
}

function callbackFunction(){
  clear();
  geolocation.map((dot) => {
    const latitude = dot.lat
    const longitude = dot.lng

    if (myMap.map.getBounds().contains({lat: latitude, lng: longitude})) {
      let pos = myMap.latLngToPixel(latitude, longitude);
      fill(255,0,0);
      noStroke();
      ellipse(pos.x, pos.y, 10, 10);
    }
  })
}