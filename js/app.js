/*
	Leaflet.label, a plugin that adds labels to markers and vectors for Leaflet powered maps.
	(c) 2012-2013, Jacob Toye, Smartrak

	https://github.com/Leaflet/Leaflet.label
	http://leafletjs.com
	https://github.com/jacobtoye
*/
(function(t){var e=t.L;e.labelVersion="0.2.2-dev",e.Label=(e.Layer?e.Layer:e.Class).extend({includes:e.Mixin.Events,options:{className:"",clickable:!1,direction:"right",noHide:!1,offset:[12,-15],opacity:1,zoomAnimation:!0},initialize:function(t,i){e.setOptions(this,t),this._source=i,this._animated=e.Browser.any3d&&this.options.zoomAnimation,this._isOpen=!1},onAdd:function(t){this._map=t,this._pane=this.options.pane?t._panes[this.options.pane]:this._source instanceof e.Marker?t._panes.markerPane:t._panes.popupPane,this._container||this._initLayout(),this._pane.appendChild(this._container),this._initInteraction(),this._update(),this.setOpacity(this.options.opacity),t.on("moveend",this._onMoveEnd,this).on("viewreset",this._onViewReset,this),this._animated&&t.on("zoomanim",this._zoomAnimation,this),e.Browser.touch&&!this.options.noHide&&(e.DomEvent.on(this._container,"click",this.close,this),t.on("click",this.close,this))},onRemove:function(t){this._pane.removeChild(this._container),t.off({zoomanim:this._zoomAnimation,moveend:this._onMoveEnd,viewreset:this._onViewReset},this),this._removeInteraction(),this._map=null},setLatLng:function(t){return this._latlng=e.latLng(t),this._map&&this._updatePosition(),this},setContent:function(t){return this._previousContent=this._content,this._content=t,this._updateContent(),this},close:function(){var t=this._map;t&&(e.Browser.touch&&!this.options.noHide&&(e.DomEvent.off(this._container,"click",this.close),t.off("click",this.close,this)),t.removeLayer(this))},updateZIndex:function(t){this._zIndex=t,this._container&&this._zIndex&&(this._container.style.zIndex=t)},setOpacity:function(t){this.options.opacity=t,this._container&&e.DomUtil.setOpacity(this._container,t)},_initLayout:function(){this._container=e.DomUtil.create("div","leaflet-label "+this.options.className+" leaflet-zoom-animated"),this.updateZIndex(this._zIndex)},_update:function(){this._map&&(this._container.style.visibility="hidden",this._updateContent(),this._updatePosition(),this._container.style.visibility="")},_updateContent:function(){this._content&&this._map&&this._prevContent!==this._content&&"string"==typeof this._content&&(this._container.innerHTML=this._content,this._prevContent=this._content,this._labelWidth=this._container.offsetWidth)},_updatePosition:function(){var t=this._map.latLngToLayerPoint(this._latlng);this._setPosition(t)},_setPosition:function(t){var i=this._map,n=this._container,o=i.latLngToContainerPoint(i.getCenter()),s=i.layerPointToContainerPoint(t),a=this.options.direction,l=this._labelWidth,h=e.point(this.options.offset);"right"===a||"auto"===a&&s.x<o.x?(e.DomUtil.addClass(n,"leaflet-label-right"),e.DomUtil.removeClass(n,"leaflet-label-left"),t=t.add(h)):(e.DomUtil.addClass(n,"leaflet-label-left"),e.DomUtil.removeClass(n,"leaflet-label-right"),t=t.add(e.point(-h.x-l,h.y))),e.DomUtil.setPosition(n,t)},_zoomAnimation:function(t){var e=this._map._latLngToNewLayerPoint(this._latlng,t.zoom,t.center).round();this._setPosition(e)},_onMoveEnd:function(){this._animated&&"auto"!==this.options.direction||this._updatePosition()},_onViewReset:function(t){t&&t.hard&&this._update()},_initInteraction:function(){if(this.options.clickable){var t=this._container,i=["dblclick","mousedown","mouseover","mouseout","contextmenu"];e.DomUtil.addClass(t,"leaflet-clickable"),e.DomEvent.on(t,"click",this._onMouseClick,this);for(var n=0;i.length>n;n++)e.DomEvent.on(t,i[n],this._fireMouseEvent,this)}},_removeInteraction:function(){if(this.options.clickable){var t=this._container,i=["dblclick","mousedown","mouseover","mouseout","contextmenu"];e.DomUtil.removeClass(t,"leaflet-clickable"),e.DomEvent.off(t,"click",this._onMouseClick,this);for(var n=0;i.length>n;n++)e.DomEvent.off(t,i[n],this._fireMouseEvent,this)}},_onMouseClick:function(t){this.hasEventListeners(t.type)&&e.DomEvent.stopPropagation(t),this.fire(t.type,{originalEvent:t})},_fireMouseEvent:function(t){this.fire(t.type,{originalEvent:t}),"contextmenu"===t.type&&this.hasEventListeners(t.type)&&e.DomEvent.preventDefault(t),"mousedown"!==t.type?e.DomEvent.stopPropagation(t):e.DomEvent.preventDefault(t)}}),e.BaseMarkerMethods={showLabel:function(){return this.label&&this._map&&(this.label.setLatLng(this._latlng),this._map.showLabel(this.label)),this},hideLabel:function(){return this.label&&this.label.close(),this},setLabelNoHide:function(t){this._labelNoHide!==t&&(this._labelNoHide=t,t?(this._removeLabelRevealHandlers(),this.showLabel()):(this._addLabelRevealHandlers(),this.hideLabel()))},bindLabel:function(t,i){var n=this.options.icon?this.options.icon.options.labelAnchor:this.options.labelAnchor,o=e.point(n)||e.point(0,0);return o=o.add(e.Label.prototype.options.offset),i&&i.offset&&(o=o.add(i.offset)),i=e.Util.extend({offset:o},i),this._labelNoHide=i.noHide,this.label||(this._labelNoHide||this._addLabelRevealHandlers(),this.on("remove",this.hideLabel,this).on("move",this._moveLabel,this).on("add",this._onMarkerAdd,this),this._hasLabelHandlers=!0),this.label=new e.Label(i,this).setContent(t),this},unbindLabel:function(){return this.label&&(this.hideLabel(),this.label=null,this._hasLabelHandlers&&(this._labelNoHide||this._removeLabelRevealHandlers(),this.off("remove",this.hideLabel,this).off("move",this._moveLabel,this).off("add",this._onMarkerAdd,this)),this._hasLabelHandlers=!1),this},updateLabelContent:function(t){this.label&&this.label.setContent(t)},getLabel:function(){return this.label},_onMarkerAdd:function(){this._labelNoHide&&this.showLabel()},_addLabelRevealHandlers:function(){this.on("mouseover",this.showLabel,this).on("mouseout",this.hideLabel,this),e.Browser.touch&&this.on("click",this.showLabel,this)},_removeLabelRevealHandlers:function(){this.off("mouseover",this.showLabel,this).off("mouseout",this.hideLabel,this),e.Browser.touch&&this.off("click",this.showLabel,this)},_moveLabel:function(t){this.label.setLatLng(t.latlng)}},e.Icon.Default.mergeOptions({labelAnchor:new e.Point(9,-20)}),e.Marker.mergeOptions({icon:new e.Icon.Default}),e.Marker.include(e.BaseMarkerMethods),e.Marker.include({_originalUpdateZIndex:e.Marker.prototype._updateZIndex,_updateZIndex:function(t){var e=this._zIndex+t;this._originalUpdateZIndex(t),this.label&&this.label.updateZIndex(e)},_originalSetOpacity:e.Marker.prototype.setOpacity,setOpacity:function(t,e){this.options.labelHasSemiTransparency=e,this._originalSetOpacity(t)},_originalUpdateOpacity:e.Marker.prototype._updateOpacity,_updateOpacity:function(){var t=0===this.options.opacity?0:1;this._originalUpdateOpacity(),this.label&&this.label.setOpacity(this.options.labelHasSemiTransparency?this.options.opacity:t)},_originalSetLatLng:e.Marker.prototype.setLatLng,setLatLng:function(t){return this.label&&!this._labelNoHide&&this.hideLabel(),this._originalSetLatLng(t)}}),e.CircleMarker.mergeOptions({labelAnchor:new e.Point(0,0)}),e.CircleMarker.include(e.BaseMarkerMethods),e.Path.include({bindLabel:function(t,i){return this.label&&this.label.options===i||(this.label=new e.Label(i,this)),this.label.setContent(t),this._showLabelAdded||(this.on("mouseover",this._showLabel,this).on("mousemove",this._moveLabel,this).on("mouseout remove",this._hideLabel,this),e.Browser.touch&&this.on("click",this._showLabel,this),this._showLabelAdded=!0),this},unbindLabel:function(){return this.label&&(this._hideLabel(),this.label=null,this._showLabelAdded=!1,this.off("mouseover",this._showLabel,this).off("mousemove",this._moveLabel,this).off("mouseout remove",this._hideLabel,this)),this},updateLabelContent:function(t){this.label&&this.label.setContent(t)},_showLabel:function(t){this.label.setLatLng(t.latlng),this._map.showLabel(this.label)},_moveLabel:function(t){this.label.setLatLng(t.latlng)},_hideLabel:function(){this.label.close()}}),e.Map.include({showLabel:function(t){return this.addLayer(t)}}),e.FeatureGroup.include({clearLayers:function(){return this.unbindLabel(),this.eachLayer(this.removeLayer,this),this},bindLabel:function(t,e){return this.invoke("bindLabel",t,e)},unbindLabel:function(){return this.invoke("unbindLabel")},updateLabelContent:function(t){this.invoke("updateLabelContent",t)}})})(window,document);
//https://gist.github.com/crofty/2197701
L.Google=L.Class.extend({includes:L.Mixin.Events,options:{minZoom:0,maxZoom:20,tileSize:256,subdomains:"abc",errorTileUrl:"",attribution:"",opacity:1,continuousWorld:!1,noWrap:!1},initialize:function(t,e){L.Util.setOptions(this,e),this._type=google.maps.MapTypeId[t||"SATELLITE"]},onAdd:function(t,e){this._map=t,this._insertAtTheBottom=e,this._initContainer(),this._initMapObject(),t.on("viewreset",this._resetCallback,this),this._limitedUpdate=L.Util.limitExecByInterval(this._update,150,this),t.on("move",this._update,this),this._reset(),this._update()},onRemove:function(){this._map._container.removeChild(this._container),this._map.off("viewreset",this._resetCallback,this),this._map.off("move",this._update,this)},getAttribution:function(){return this.options.attribution},setOpacity:function(t){this.options.opacity=t,1>t&&L.DomUtil.setOpacity(this._container,t)},_initContainer:function(){var t=this._map._container;first=t.firstChild,this._container||(this._container=L.DomUtil.create("div","leaflet-google-layer leaflet-top leaflet-left"),this._container.id="_GMapContainer"),t.insertBefore(this._container,first),this.setOpacity(this.options.opacity);var e=this._map.getSize();this._container.style.width=e.x+"px",this._container.style.height=e.y+"px",this._container.style.zIndex=0},_initMapObject:function(){this._google_center=new google.maps.LatLng(0,0);var t=new google.maps.Map(this._container,{center:this._google_center,zoom:0,mapTypeId:this._type,disableDefaultUI:!0,keyboardShortcuts:!1,draggable:!1,disableDoubleClickZoom:!0,scrollwheel:!1,streetViewControl:!1});t.backgroundColor="#ff0000",this._google=t},_resetCallback:function(t){this._reset(t.hard)},_reset:function(){this._initContainer()},_update:function(){this._resize();var t=this._map.getBounds(),e=t.getNorthEast(),i=t.getSouthWest(),o=(new google.maps.LatLngBounds(new google.maps.LatLng(i.lat,i.lng),new google.maps.LatLng(e.lat,e.lng)),this._map.getCenter()),n=new google.maps.LatLng(o.lat,o.lng);this._google.setCenter(n),this._google.setZoom(this._map.getZoom())},_resize:function(){var t=this._map.getSize();(this._container.style.width!=t.x||this._container.style.height!=t.y)&&(this._container.style.width=t.x+"px",this._container.style.height=t.y+"px",google.maps.event.trigger(this._google,"resize"))}});

function RoadSegment(opts) {
  return {
    roadSegment: opts.roadSegment || '',
    surfaceType: opts.surfaceType || '',
    segmentLength: opts.segmentLength || 0,
    segmentArea: opts.segmentArea || 0,
    repairTypes: opts.repairTypes || []
  }
}

function updateDownloadURL(roadSegments) {
  var csvArray = ['Road Segment,Surface Type,Repair Type,Segment Length,Units,Cost per Unit,Total Cost'],
    linearRepairs = ['Shoulder Cut', 'Double-Yellow Centerline', 'Single-White Edge Line', 'Crack Seal', 'Guide Rail']
  roadSegments.forEach(function (rs) {
    rs.repairTypes.forEach(function (repair) {
      csvArray.push([rs.roadSegment, rs.surfaceType, repair, $.inArray(repair, linearRepairs) > -1 ? rs.segmentLength * 5280 : rs.segmentArea, $.inArray(repair, linearRepairs) > -1 ? 'lf' : 'sq yd', '', ''].join(','))
    })
  })
  $('.btn-create').attr('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvArray.join('\n')))
}

$(function () {
  var colors = ['#444', '#FF0C00', '#FF7800', '#FFF600', '#87FF00'],
  condition = ['Unknown', 'Poor', 'Fair', 'Good', 'Excellent'],
  mcds = {
  	'15206': '',
  	'15228': '',
  	'46106': '',
  	'46112': '',
  	'46114': '',
  	'46201': '',
  	'46212': '',
  	'46416': ''
  },
  Legend = L.Control.extend({
  	onAdd: function () {
  		var container = L.DomUtil.create('div', 'legend-control'),
  			conditions = condition.slice().reverse()
 
  		container.innerHTML += '<h4 style="margin: 0 0 5px;">Condition</h4>'
  		colors.slice().reverse().forEach(function (c, i) {
  			container.innerHTML += '<i style="background-color: ' + c + ';"></i> ' + conditions[i] + '<br/>'
  		})
  		return container
  	}
  }),
  map = L.map('map', {
    center: [40.2837, -75.6143],
    zoom: 10,
    layers: [new L.Google('HYBRID')]
  }).addControl(new Legend({position: 'bottomleft'})),
  roads = L.geoJson(null, {
    style: function (feature) {
      return {
        color: colors[+feature.properties.STRUCT_CONDITION_CD],
        weight: 2,
        opacity: 1
      }
    },
    onEachFeature: function (feature, layer) {
    	layer.bindLabel(feature.properties.LR_STREET_NAME + ': ' + feature.properties.BEGIN_TERM_STREET_NAME + ' - ' + feature.properties.END_TERM_STREET_NAME)
    }
  }).on('click', function (e) {
  	var modal = $('#modal-repair'),
  	  type
  	  
	  ['BITUMINOUS_MILES', 'BRICK_MILES', 'CONCRETE_MILES', 'GRAVEL_MILES', 'SEAL_COATED_MILES', 'UNIMPROVED_MILES'].some(function (x) {
	    if (e.layer.feature.properties.hasOwnProperty(x) && e.layer.feature.properties[x] > 0) {
	      return type = x
	    }
	  })
  	modal.find('.property-road-segment').text(e.layer.feature.properties.LR_STREET_NAME + ': ' + e.layer.feature.properties.BEGIN_TERM_STREET_NAME + ' - ' + e.layer.feature.properties.END_TERM_STREET_NAME)
  	modal.find('.property-road-segment-type').text(type.split('_')[0])
  	modal.find('.property-road-segment-condition').text(condition[+e.layer.feature.properties.STRUCT_CONDITION_CD])
  	modal.find('.property-road-segment-federalaid').text(e.layer.feature.properties.IS_FED_AID)
  	modal.find('.property-road-segment-act32').text(e.layer.feature.properties.ACT32)
  	modal.find('.property-road-segment-length').text(e.layer.feature.properties.SEG_LENGTH_MILES)
  	modal.find('.property-road-segment-mcd').text(mcds[e.layer.feature.properties.MUNICIPALITY_CD])
  	modal.find('.property-road-segment-owner').text(e.layer.feature.properties.LR_OWNER_CD)
  	modal.find('.property-road-segment-cartway').text(e.layer.feature.properties.CARTWAY_WIDTH_FT)
  	modal.find('.property-road-segment-road').text(e.layer.feature.properties.ROAD_TYPE_CD)
  	modal.find('.property-road-segment-liquidfuels').text(e.layer.feature.properties.IS_LIQUID_FUELS_ROAD)
  	modal.find('.property-road-segment-private').text(e.layer.feature.properties.IS_PRIVATE_ROAD)
  	modal.find('.property-road-segment-area').text(e.layer.feature.properties.CARTWAY_WIDTH_FT / 3 * e.layer.feature.properties.SEG_LENGTH_MILES * 1760)
  	modal.modal('show')
  }).addTo(map),
  topPane = map._createPane('leaflet-top-pane', map.getPanes().overlayPane),
  topLayer = L.tileLayer('http://openmapsurfer.uni-hd.de/tiles/adminb/x={x}&y={y}&z={z}', {
  	minZoom: 0,
  	maxZoom: 19,
  	attribution: 'Imagery &copy; <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a>, Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).setZIndex(20).addTo(map),
  roadSegments = []
  
  $.getJSON('data/local_roads.geojson', function (data) {
    roads.addData(data)
    map.fitBounds(roads.getBounds())
  })
  
  topPane.appendChild(topLayer.getContainer())

  $(document).on('click', '[data-toggle="offcanvas"]', function () {
    $('.row-offcanvas').toggleClass('active')
  }).on('click', '.repair-type-list a', function (e) {
  	e.preventDefault()
  	$(this).parent('li').toggleClass('active').closest('.btn-group').next('.help-block').text($(this).closest('ul').find('.active').map(function () { return $(this).text()}).get().join(', '))
  }).on('click', '.btn-submit-repair', function (e) {
  	e.preventDefault()
  	var modal = $(this).closest('.modal').modal('hide')
  	
  	roadSegments.push(new RoadSegment({
	    roadSegment: modal.find('.property-road-segment').text(),
	    surfaceType: modal.find('.property-road-segment-type').text(),
	    segmentLength: modal.find('.property-road-segment-length').text(),
	    segmentArea: modal.find('.property-road-segment-area').text(),
	    repairTypes: modal.find('.help-block').text().split(', ')
	  }))
  	$('.list-repairs').append('<li class="list-group-item"><h4 class="list-group-item-heading">' + modal.find('.property-road-segment').text() + '</h4><p class="list-group-item-text">' + modal.find('.help-block').text() + '</p></li>')
  	updateDownloadURL(roadSegments)
  }).on('dblclick', '.list-repairs>li', function () {
  	if (confirm('Are you sure you want to delete this row?')) {
  	  roadSegments.splice([$(this).parent().find('li').index(this)], 1)
  	  $(this).remove()
  	  updateDownloadURL(roadSegments)
  	}
  })
})
