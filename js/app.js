$(function () {
  var map = L.map('map', {
    center: [39.952473, -75.164106],
    zoom: 10,
    layers: [
      L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      	attribution: '&copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      	subdomains: 'abcd',
      	minZoom: 0,
      	maxZoom: 18
      })
    ]
  }),
  roads = L.geoJson(null, {
    style: function (feature) {
      return {
        color: ['#6c943e', '#8b943f', '#95803f', '#956240', '#964541'][+feature.properties.STRUCT_CONDITION_CD],
        weight: 2,
        opacity: 1
      }
    }
  }).addTo(map),
  topPane = map._createPane('leaflet-top-pane', map.getPanes().overlayPane),
  topLayer = L.tileLayer('http://openmapsurfer.uni-hd.de/tiles/adminb/x={x}&y={y}&z={z}', {
  	minZoom: 0,
  	maxZoom: 19,
  	attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).setZIndex(20).addTo(map)
  
  $.getJSON('data/local_roads.geojson', function (data) {
      roads.addData(data)
      map.fitBounds(roads.getBounds())
  })
  
  topPane.appendChild(topLayer.getContainer())

  $(document).on('click', '[data-toggle="offcanvas"]', function () {
    $('.row-offcanvas').toggleClass('active')
  })
})
