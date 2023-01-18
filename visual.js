// -----------------
let geolocation = [{
  lat: 0,
  lng: 0,
}]

let sensor = [{
  gx: 0,
  gy: 0,
  gz: 0,
  ax: 0,
  ay: 0,
  az: 0
}]

let tableGeolocation, tableSensor;
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

function preload() {
  tableGeolocation = loadTable('data/geolocation-10-9-2022-15-26.csv', 'csv', 'header');
  tableSensor = loadTable('data/sensors-10-9-2022-15-26.csv', 'csv', 'header');
}


function setup() {
  //noCanvas()
  canvas = createCanvas(windowWidth * 0.60, windowHeight)
  canvas.style('display', 'flex');
  canvas.parent('#div')

  for (let r = 2; r < tableGeolocation.getRowCount(); r++)
    geolocation[r] = {
      lat: tableGeolocation.getString(r, 0),
      lng: tableGeolocation.getString(r, 1)
    }

  for (let r = 2; r < tableSensor.getRowCount(); r++)
    sensor[r] = {
      gx: tableSensor.getString(r, 0),
      gy: tableSensor.getString(r, 1),
      gz: tableSensor.getString(r, 2),
      ax: tableSensor.getString(r, 3),
      ay: tableSensor.getString(r, 4),
      az: tableSensor.getString(r, 5)
    }
  console.log(tableSensor.getRowCount())
  console.log(tableGeolocation.getRowCount())
  console.log(geolocation);

  myMap = mappa.tileMap(options)
  myMap.overlay(canvas)
  myMap.onChange(callbackFunction)
}

function draw() {

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

/*
  228 datos geolocation
  18936 datos sensor
  18936 / 228 = 83 datos de sensor por cada dato de geolocation
  Si hago click en cada punto, puede mostrar un modelo del instante en el cual estaba pasando por ahí, una especie de foto 3D del momento andando en bici en ese lugar.
  Cada recorrido puede tener un color que lo diferencie
*/