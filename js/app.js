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
      }),
      L.tileLayer('http://openmapsurfer.uni-hd.de/tiles/adminb/x={x}&y={y}&z={z}', {
      	minZoom: 0,
      	maxZoom: 19,
      	attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ]
  })
  
  $(document).on('click', '[data-toggle="offcanvas"]', function () {
    $('.row-offcanvas').toggleClass('active')
  })
})
    
