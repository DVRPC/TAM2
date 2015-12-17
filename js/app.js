/*
Leaflet.label, a plugin that adds labels to markers and vectors for Leaflet powered maps.
(c) 2012-2013, Jacob Toye, Smartrak

https://github.com/Leaflet/Leaflet.label
http://leafletjs.com
https://github.com/jacobtoye
*/
(function(t){var e=t.L;e.labelVersion="0.2.2-dev",e.Label=(e.Layer?e.Layer:e.Class).extend({includes:e.Mixin.Events,options:{className:"",clickable:!1,direction:"right",noHide:!1,offset:[12,-15],opacity:1,zoomAnimation:!0},initialize:function(t,i){e.setOptions(this,t),this._source=i,this._animated=e.Browser.any3d&&this.options.zoomAnimation,this._isOpen=!1},onAdd:function(t){this._map=t,this._pane=this.options.pane?t._panes[this.options.pane]:this._source instanceof e.Marker?t._panes.markerPane:t._panes.popupPane,this._container||this._initLayout(),this._pane.appendChild(this._container),this._initInteraction(),this._update(),this.setOpacity(this.options.opacity),t.on("moveend",this._onMoveEnd,this).on("viewreset",this._onViewReset,this),this._animated&&t.on("zoomanim",this._zoomAnimation,this),e.Browser.touch&&!this.options.noHide&&(e.DomEvent.on(this._container,"click",this.close,this),t.on("click",this.close,this))},onRemove:function(t){this._pane.removeChild(this._container),t.off({zoomanim:this._zoomAnimation,moveend:this._onMoveEnd,viewreset:this._onViewReset},this),this._removeInteraction(),this._map=null},setLatLng:function(t){return this._latlng=e.latLng(t),this._map&&this._updatePosition(),this},setContent:function(t){return this._previousContent=this._content,this._content=t,this._updateContent(),this},close:function(){var t=this._map;t&&(e.Browser.touch&&!this.options.noHide&&(e.DomEvent.off(this._container,"click",this.close),t.off("click",this.close,this)),t.removeLayer(this))},updateZIndex:function(t){this._zIndex=t,this._container&&this._zIndex&&(this._container.style.zIndex=t)},setOpacity:function(t){this.options.opacity=t,this._container&&e.DomUtil.setOpacity(this._container,t)},_initLayout:function(){this._container=e.DomUtil.create("div","leaflet-label "+this.options.className+" leaflet-zoom-animated"),this.updateZIndex(this._zIndex)},_update:function(){this._map&&(this._container.style.visibility="hidden",this._updateContent(),this._updatePosition(),this._container.style.visibility="")},_updateContent:function(){this._content&&this._map&&this._prevContent!==this._content&&"string"==typeof this._content&&(this._container.innerHTML=this._content,this._prevContent=this._content,this._labelWidth=this._container.offsetWidth)},_updatePosition:function(){var t=this._map.latLngToLayerPoint(this._latlng);this._setPosition(t)},_setPosition:function(t){var i=this._map,n=this._container,o=i.latLngToContainerPoint(i.getCenter()),s=i.layerPointToContainerPoint(t),a=this.options.direction,l=this._labelWidth,h=e.point(this.options.offset);"right"===a||"auto"===a&&s.x<o.x?(e.DomUtil.addClass(n,"leaflet-label-right"),e.DomUtil.removeClass(n,"leaflet-label-left"),t=t.add(h)):(e.DomUtil.addClass(n,"leaflet-label-left"),e.DomUtil.removeClass(n,"leaflet-label-right"),t=t.add(e.point(-h.x-l,h.y))),e.DomUtil.setPosition(n,t)},_zoomAnimation:function(t){var e=this._map._latLngToNewLayerPoint(this._latlng,t.zoom,t.center).round();this._setPosition(e)},_onMoveEnd:function(){this._animated&&"auto"!==this.options.direction||this._updatePosition()},_onViewReset:function(t){t&&t.hard&&this._update()},_initInteraction:function(){if(this.options.clickable){var t=this._container,i=["dblclick","mousedown","mouseover","mouseout","contextmenu"];e.DomUtil.addClass(t,"leaflet-clickable"),e.DomEvent.on(t,"click",this._onMouseClick,this);for(var n=0;i.length>n;n++)e.DomEvent.on(t,i[n],this._fireMouseEvent,this)}},_removeInteraction:function(){if(this.options.clickable){var t=this._container,i=["dblclick","mousedown","mouseover","mouseout","contextmenu"];e.DomUtil.removeClass(t,"leaflet-clickable"),e.DomEvent.off(t,"click",this._onMouseClick,this);for(var n=0;i.length>n;n++)e.DomEvent.off(t,i[n],this._fireMouseEvent,this)}},_onMouseClick:function(t){this.hasEventListeners(t.type)&&e.DomEvent.stopPropagation(t),this.fire(t.type,{originalEvent:t})},_fireMouseEvent:function(t){this.fire(t.type,{originalEvent:t}),"contextmenu"===t.type&&this.hasEventListeners(t.type)&&e.DomEvent.preventDefault(t),"mousedown"!==t.type?e.DomEvent.stopPropagation(t):e.DomEvent.preventDefault(t)}}),e.BaseMarkerMethods={showLabel:function(){return this.label&&this._map&&(this.label.setLatLng(this._latlng),this._map.showLabel(this.label)),this},hideLabel:function(){return this.label&&this.label.close(),this},setLabelNoHide:function(t){this._labelNoHide!==t&&(this._labelNoHide=t,t?(this._removeLabelRevealHandlers(),this.showLabel()):(this._addLabelRevealHandlers(),this.hideLabel()))},bindLabel:function(t,i){var n=this.options.icon?this.options.icon.options.labelAnchor:this.options.labelAnchor,o=e.point(n)||e.point(0,0);return o=o.add(e.Label.prototype.options.offset),i&&i.offset&&(o=o.add(i.offset)),i=e.Util.extend({offset:o},i),this._labelNoHide=i.noHide,this.label||(this._labelNoHide||this._addLabelRevealHandlers(),this.on("remove",this.hideLabel,this).on("move",this._moveLabel,this).on("add",this._onMarkerAdd,this),this._hasLabelHandlers=!0),this.label=new e.Label(i,this).setContent(t),this},unbindLabel:function(){return this.label&&(this.hideLabel(),this.label=null,this._hasLabelHandlers&&(this._labelNoHide||this._removeLabelRevealHandlers(),this.off("remove",this.hideLabel,this).off("move",this._moveLabel,this).off("add",this._onMarkerAdd,this)),this._hasLabelHandlers=!1),this},updateLabelContent:function(t){this.label&&this.label.setContent(t)},getLabel:function(){return this.label},_onMarkerAdd:function(){this._labelNoHide&&this.showLabel()},_addLabelRevealHandlers:function(){this.on("mouseover",this.showLabel,this).on("mouseout",this.hideLabel,this),e.Browser.touch&&this.on("click",this.showLabel,this)},_removeLabelRevealHandlers:function(){this.off("mouseover",this.showLabel,this).off("mouseout",this.hideLabel,this),e.Browser.touch&&this.off("click",this.showLabel,this)},_moveLabel:function(t){this.label.setLatLng(t.latlng)}},e.Icon.Default.mergeOptions({labelAnchor:new e.Point(9,-20)}),e.Marker.mergeOptions({icon:new e.Icon.Default}),e.Marker.include(e.BaseMarkerMethods),e.Marker.include({_originalUpdateZIndex:e.Marker.prototype._updateZIndex,_updateZIndex:function(t){var e=this._zIndex+t;this._originalUpdateZIndex(t),this.label&&this.label.updateZIndex(e)},_originalSetOpacity:e.Marker.prototype.setOpacity,setOpacity:function(t,e){this.options.labelHasSemiTransparency=e,this._originalSetOpacity(t)},_originalUpdateOpacity:e.Marker.prototype._updateOpacity,_updateOpacity:function(){var t=0===this.options.opacity?0:1;this._originalUpdateOpacity(),this.label&&this.label.setOpacity(this.options.labelHasSemiTransparency?this.options.opacity:t)},_originalSetLatLng:e.Marker.prototype.setLatLng,setLatLng:function(t){return this.label&&!this._labelNoHide&&this.hideLabel(),this._originalSetLatLng(t)}}),e.CircleMarker.mergeOptions({labelAnchor:new e.Point(0,0)}),e.CircleMarker.include(e.BaseMarkerMethods),e.Path.include({bindLabel:function(t,i){return this.label&&this.label.options===i||(this.label=new e.Label(i,this)),this.label.setContent(t),this._showLabelAdded||(this.on("mouseover",this._showLabel,this).on("mousemove",this._moveLabel,this).on("mouseout remove",this._hideLabel,this),e.Browser.touch&&this.on("click",this._showLabel,this),this._showLabelAdded=!0),this},unbindLabel:function(){return this.label&&(this._hideLabel(),this.label=null,this._showLabelAdded=!1,this.off("mouseover",this._showLabel,this).off("mousemove",this._moveLabel,this).off("mouseout remove",this._hideLabel,this)),this},updateLabelContent:function(t){this.label&&this.label.setContent(t)},_showLabel:function(t){this.label.setLatLng(t.latlng),this._map.showLabel(this.label)},_moveLabel:function(t){this.label.setLatLng(t.latlng)},_hideLabel:function(){this.label.close()}}),e.Map.include({showLabel:function(t){return this.addLayer(t)}}),e.FeatureGroup.include({clearLayers:function(){return this.unbindLabel(),this.eachLayer(this.removeLayer,this),this},bindLabel:function(t,e){return this.invoke("bindLabel",t,e)},unbindLabel:function(){return this.invoke("unbindLabel")},updateLabelContent:function(t){this.invoke("updateLabelContent",t)}})})(window,document);
//https://gist.github.com/crofty/2197701
L.Google=L.Class.extend({includes:L.Mixin.Events,options:{minZoom:0,maxZoom:20,tileSize:256,subdomains:"abc",errorTileUrl:"",attribution:"",opacity:1,continuousWorld:!1,noWrap:!1},initialize:function(t,i){L.Util.setOptions(this,i),this._styles=i.styles||null,this._type=google.maps.MapTypeId[t||"SATELLITE"]},onAdd:function(t,i){this._map=t,this._insertAtTheBottom=i,this._initContainer(),this._initMapObject(),t.on("viewreset",this._resetCallback,this),this._limitedUpdate=L.Util.limitExecByInterval(this._update,150,this),t.on("move",this._update,this),this._reset(),this._update()},onRemove:function(){this._map._container.removeChild(this._container),this._map.off("viewreset",this._resetCallback,this),this._map.off("move",this._update,this)},getAttribution:function(){return this.options.attribution},setOpacity:function(t){this.options.opacity=t,1>t&&L.DomUtil.setOpacity(this._container,t)},_initContainer:function(){var t=this._map._container;first=t.firstChild,this._container||(this._container=L.DomUtil.create("div","leaflet-google-layer leaflet-top leaflet-left"),this._container.id="_GMapContainer"),t.insertBefore(this._container,first),this.setOpacity(this.options.opacity);var i=this._map.getSize();this._container.style.width=i.x+"px",this._container.style.height=i.y+"px",this._container.style.zIndex=0},_initMapObject:function(){this._google_center=new google.maps.LatLng(0,0);var t=new google.maps.Map(this._container,{center:this._google_center,zoom:0,mapTypeId:this._type,disableDefaultUI:!0,keyboardShortcuts:!1,draggable:!1,disableDoubleClickZoom:!0,scrollwheel:!1,streetViewControl:!1});t.Color="#ff0000",this._styles&&t.setOptions({styles:this._styles}),this._google=t},_resetCallback:function(t){this._reset(t.hard)},_reset:function(){this._initContainer()},_update:function(){this._resize();var t=this._map.getCenter(),i=new google.maps.LatLng(t.lat,t.lng);this._google.setCenter(i),this._google.setZoom(this._map.getZoom())},_resize:function(){var t=this._map.getSize();(this._container.style.width!=t.x||this._container.style.height!=t.y)&&(this._container.style.width=t.x+"px",this._container.style.height=t.y+"px",google.maps.event.trigger(this._google,"resize"))}});
//https://github.com/jieter/Leaflet.encoded
!function(){"use strict";var e=function(e){return e="number"==typeof e?{precision:e}:e||{},e.precision=e.precision||5,e.factor=e.factor||Math.pow(10,e.precision),e.dimension=e.dimension||2,e},n={encode:function(n,o){o=e(o);for(var r=[],t=0,i=n.length;i>t;++t){var d=n[t];if(2===o.dimension)r.push(d.lat||d[0]),r.push(d.lng||d[1]);else for(var c=0;c<o.dimension;++c)r.push(d[c])}return this.encodeDeltas(r,o)},decode:function(n,o){o=e(o);for(var r=this.decodeDeltas(n,o),t=[],i=0,d=r.length;i+(o.dimension-1)<d;){for(var c=[],s=0;s<o.dimension;++s)c.push(r[i++]);t.push(c)}return t},encodeDeltas:function(n,o){o=e(o);for(var r=[],t=0,i=n.length;i>t;)for(var d=0;d<o.dimension;++d,++t){var c=n[t],s=c-(r[d]||0);r[d]=c,n[t]=s}return this.encodeFloats(n,o)},decodeDeltas:function(n,o){o=e(o);for(var r=[],t=this.decodeFloats(n,o),i=0,d=t.length;d>i;)for(var c=0;c<o.dimension;++c,++i)t[i]=r[c]=t[i]+(r[c]||0);return t},encodeFloats:function(n,o){o=e(o);for(var r=0,t=n.length;t>r;++r)n[r]=Math.round(n[r]*o.factor);return this.encodeSignedIntegers(n)},decodeFloats:function(n,o){o=e(o);for(var r=this.decodeSignedIntegers(n),t=0,i=r.length;i>t;++t)r[t]/=o.factor;return r},encodeSignedIntegers:function(e){for(var n=0,o=e.length;o>n;++n){var r=e[n];e[n]=0>r?~(r<<1):r<<1}return this.encodeUnsignedIntegers(e)},decodeSignedIntegers:function(e){for(var n=this.decodeUnsignedIntegers(e),o=0,r=n.length;r>o;++o){var t=n[o];n[o]=1&t?~(t>>1):t>>1}return n},encodeUnsignedIntegers:function(e){for(var n="",o=0,r=e.length;r>o;++o)n+=this.encodeUnsignedInteger(e[o]);return n},decodeUnsignedIntegers:function(e){for(var n=[],o=0,r=0,t=0,i=e.length;i>t;++t){var d=e.charCodeAt(t)-63;o|=(31&d)<<r,32>d?(n.push(o),o=0,r=0):r+=5}return n},encodeSignedInteger:function(e){return e=0>e?~(e<<1):e<<1,this.encodeUnsignedInteger(e)},encodeUnsignedInteger:function(e){for(var n,o="";e>=32;)n=(32|31&e)+63,o+=String.fromCharCode(n),e>>=5;return n=e+63,o+=String.fromCharCode(n)}};if("object"==typeof module&&"object"==typeof module.exports&&(module.exports=n),"object"==typeof L){L.Polyline.prototype.fromEncoded||(L.Polyline.fromEncoded=function(e,o){return new L.Polyline(n.decode(e),o)}),L.Polygon.prototype.fromEncoded||(L.Polygon.fromEncoded=function(e,o){return new L.Polygon(n.decode(e),o)});var o={encodePath:function(){return n.encode(this.getLatLngs())}};L.Polyline.prototype.encodePath||L.Polyline.include(o),L.Polygon.prototype.encodePath||L.Polygon.include(o),L.PolylineUtil=n}}();

var condition = ['Unknown', 'Poor', 'Fair', 'Good', 'Excellent'];
var colors = ['#999999', '#FF0C00', '#FF7800', '#FFF600', '#87FF00'];

var linearRepairs = ['Shoulder Cut', 'Double-Yellow Centerline', 'Single-White Edge Line', 'Crack Seal', 'Guide Rail'];
var roadJSONData = [];

function ColorCondition(con) {
    var i = condition.indexOf( con );
    if (i < 0) {
        return "purple";
    } else {
        return colors[i];
    }
}

function RoadSegment(opts) {
    return {
        roadSegment: opts.roadSegment || '',
        segmentLength: opts.segmentLength || 0,
        segmentArea: opts.segmentArea || 0,
        repairTypes: opts.repairTypes || [],
        repairCostUnits: opts.repairCostUnits || [],
        repairSubtotals: opts.repairSubtotals || [],
        repairTotal: opts.repairTotal || 0
    }
}

function EncodedLayer(layer) {
  return {
    toUrlString: function () {
      if (layer.toGeoJSON().geometry.type === 'Polygon') {
        var ls = layer.getLatLngs()
        return 'path=color:0x0000aa00|fillcolor:0x0000aa60|enc:' + L.PolylineUtil.encode(ls)
      }
      else {
        if (layer.hasOwnProperty('feature')) {
          return 'path=color:0x' + colors[+layer.feature.properties.STRUCT_CON].slice(1) + 'ff|enc:' + L.PolylineUtil.encode(layer.getLatLngs())
        }
        else {
          return 'path=color:0x0000aaff|enc:' + L.PolylineUtil.encode(layer.getLatLngs())
        }
      }
    }
  }
}

function updateDownloadURL(roadSegments) {
    var csvArray = ['Road Segment,Repair Type,Measurement,Units,Cost per Unit,Total Cost']
    roadSegments.forEach(function (rs) {
        for (i = 0; i < rs.repairTypes.length; i++) {
            csvArray.push([rs.roadSegment, rs.repairTypes[i], $.inArray(rs.repairTypes[i], linearRepairs) > -1 ? '"'+String(rs.segmentLength * 5280)+'"' : '"'+rs.segmentArea+'"', $.inArray(rs.repairTypes[i], linearRepairs) > -1 ? 'lf' : 'sq yd', '"'+numeral(rs.repairCostUnits[i]).format('$0,0.00')+'"', '"'+numeral(rs.repairSubtotals[i]).format('$0,0.00')+'"'].join(','));
            // csvArray.push([rs.roadSegment, rs.repairTypes[i], $.inArray(rs.repairTypes[i], linearRepairs) > -1 ? rs.segmentLength * 5280 : rs.segmentArea, $.inArray(rs.repairTypes[i], linearRepairs) > -1 ? 'lf' : 'sq yd', rs.repairCostUnits[i], rs.repairSubtotals[i]].join(','));
        }
    })
    $('.btn-create').attr('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvArray.join('\n')));
}

function updateEncodedURL(map, groups) {
    var encoded = []
    groups.forEach(function (group) {
      if (group !== undefined) group.eachLayer(function (layer) {
        if (map.getBounds().intersects(layer.getBounds())) {
          encoded.push(new EncodedLayer(layer))
        }
      })
    })

    $('.google-static-map-link').prop('href', 'https://maps.googleapis.com/maps/api/staticmap?size=640x640&maptype=hybrid&center=' + map.getCenter().lat + ',' + map.getCenter().lng + '&zoom=' + map.getZoom() + '&' + encoded.map(function (o) { return o.toUrlString()}).join('&'))
  }

function getDistance(array, decimals) {
    if (Number.prototype.toRad === undefined) {
        Number.prototype.toRad = function () {
            return this * Math.PI / 180;
        };
    }
    decimals = decimals || 3;
    var earthRadius = 6378.137, // km
    distance = 0,
    len = array.length,
    i,
    x1,
    x2,
    lat1,
    lat2,
    lon1,
    lon2,
    dLat,
    dLon,
    a,
    c,
    d;
    for (i = 0; (i + 1) < len; i++) {
        x1 = array[i];
        x2 = array[i + 1];
        lat1 = parseFloat(x1[1]);
        lat2 = parseFloat(x2[1]);
        lon1 = parseFloat(x1[0]);
        lon2 = parseFloat(x2[0]);
        dLat = (lat2 - lat1).toRad();
        dLon = (lon2 - lon1).toRad();
        lat1 = lat1.toRad();
        lat2 = lat2.toRad();
        a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        d = earthRadius * c;
        distance += d;
    }
    distance = Math.round(distance * Math.pow(10, decimals)) / Math.pow(10, decimals);
    return distance;
}

function updateCostEstimate(roadSegments) {
    var total = 0;
    var count = 0;
    roadSegments.forEach( function (rs) {
        total += rs.repairTotal;
        count += 1;
    })
    $('#totalcostvalue').text( "$" + String(numeral(total).format('0,0.00')) );
    // .text([d.properties.STATION+" : "+numeral(d.properties.RS_FINAL).format('0.0')]);
    $('#numroad').text( count );
}
function updateDefaultCostUnits() {
    var defaultCostUnits = getDefaultCostUnits();
    $(".repair-table").find(".costunit").each( function( i ) {
        $(this).val( defaultCostUnits[i] );
    })
}
// In retrospect, this is a shitty function name. This deals with the modal window repairs
function updateRepairList( enabledRepairs ) {
    var length = Number(numeral().unformat($("#modal-repair").find('.property-road-segment-length').text()));
    var area = Number(numeral().unformat($("#modal-repair").find('.property-road-segment-area').text()));
    //var area = Number($("#modal-repair").find('.property-road-segment-area').text());
    var total = 0;
    $(".repair-table").find(".rtr-subtotal.rtr-value").each( function( i ) {
        if (enabledRepairs[i]) {
            var unitcost = Number($(this).parent().find(".costunit").val())
            if ( linearRepairs.indexOf( $(this).parent().find(".rtr-type.rtr-value").text() ) < 0 ) {
                $(this).text(numeral(area * unitcost).format('$0,0.00'));
                //$(this).text( (area * unitcost).toFixed(2) );
                total += ( area * unitcost );
            } else {
                $(this).text( numeral(length * 5280 * unitcost).format('$0,0.00'));
              // $(this).text( (length * 5280 * unitcost).toFixed(2) );
                total += ( length * 5280 * unitcost );
            }
        } else {
            $(this).text("");
        }
    })
      $(".repair-table").find(".rtr-total.rtr-value").text(numeral(total).format('$0,0.00') );
 //   $(".repair-table").find(".rtr-total.rtr-value").text(total.toFixed(2) );
}
function updateRoadRepairList( roadSegments ){
    // roadSegment: opts.roadSegment || '',
    // segmentLength: opts.segmentLength || 0,
    // segmentArea: opts.segmentArea || 0,
    // repairTypes: opts.repairTypes || [],
    // repairCostUnits: opts.repairCostUnits || [],
    // repairSubtotals: opts.repairSubtotals || [],
    // repairTotal: opts.repairTotal || 0
    $('.list-repairs').empty();
    for (var i = 0; i < roadSegments.length; i++) {
        $('.list-repairs').append('<li class="list-group-item"><h4 class="list-group-item-heading">' + 
            roadSegments[i].roadSegment + 
            '</h4><h4 class="list-group-item-heading">' + 
            numeral(roadSegments[i].repairTotal).format('$0,0.00') + 
            '</h4><p class="list-group-item-text">' + 
            roadSegments[i].repairTypes.join(", ") + '</p></li>')
    }
}
function getEnabledRepairs() {
    var enabledRepairs = [];
    $(".repair-table").find(".repair-enable").each( function( i ) {
        enabledRepairs.push( $(".repair-table").find(".repair-enable")[i].checked );
    })
    return enabledRepairs;
}
function getTreatments( enabledRepairs ) {
    var treatments = [];
    $(".repair-table").find(".rtr-type.rtr-value").each( function( i ) {
        if (enabledRepairs[i]) {
            treatments.push($(this).text());
        }
    })
    return treatments;
}
function getCostUnits( enabledRepairs ) {
    var costunits = [];
    $(".repair-table").find(".rtr-costunit.rtr-value").each( function( i ) {
        if (enabledRepairs[i]) {
            costunits.push(Number($(this).find(".costunit").val()));
        }
    })
    return costunits;
}
function getSubtotals( enabledRepairs ) {
    var subtotals = [];
    $(".repair-table").find(".rtr-subtotal.rtr-value").each( function( i ) {
        if (enabledRepairs[i]) {
             subtotals.push(Number(numeral().unformat($(this).text())));
           // subtotals.push(Number($(this).text()));
        }
    })
    return subtotals;
}
function getTotal( ){
        return Number(numeral().unformat($(".repair-table").find(".rtr-total.rtr-value").text()));
    //return Number($(".repair-table").find(".rtr-total.rtr-value").text());
}
function getDefaultCostUnits() {
    var defaultCostUnits = [];
    $(".costunit-table").find(".cutr-costunit").each( function( i ){
        defaultCostUnits.push( Number($(this).val()) );
    })
    return defaultCostUnits;
}
function filterRoadData( roadJSONData, struct_con ) {
    // Array Comprehension no worky?
    var abbrvRoadData = [];
    for (var i = 0; i < roadJSONData.features.length; i++) {
        if ( roadJSONData.features[i].properties.STRUCT_CON == String(struct_con) ) {
            abbrvRoadData.push( roadJSONData.features[i] );
        }
    }
    return { "type":"FeatureCollection", "features":abbrvRoadData };
}

$(function () {
    Legend = L.Control.extend({
        onAdd: function () {
            var container = L.DomUtil.create('div', 'legend-control');
            conditions = condition.slice().reverse();
            container.innerHTML += '<h4 style="margin: 0 0 5px;">Road Condition</h4>';
            colors.slice().reverse().forEach(function (c, i) {
                container.innerHTML += '<i style="background-color: ' + c + ';"></i> ' + conditions[i] + '<br/>'
            });
            return container;
        }
    });
    
    LayerLegend = L.Control.Layers.extend({
        options: {
            collapsed: false,
            position: 'bottomleft',
            autoZIndex: true
        },
        _initLayout: function () {
            var className = 'leaflet-control-layers legend-control',
                container = this._container = L.DomUtil.create('div', className);
            
            //Makes this work on IE10 Touch devices by stopping it from firing a mouseout event when the touch is released
            container.setAttribute('aria-haspopup', true);
            
            container.innerHTML += '<h4 style="margin: 0 0 5px;">Road Condition</h4>';
            
            if (!L.Browser.touch) {
                L.DomEvent
                    .disableClickPropagation(container)
                    .disableScrollPropagation(container);
            } else {
                L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
            }

            var form = this._form = L.DomUtil.create('form', className + '-list');
            
            /*
            if (this.options.collapsed) {
                if (!L.Browser.android) {
                    L.DomEvent
                        .on(container, 'mouseover', this._expand, this)
                        .on(container, 'mouseout', this._collapse, this);
                }
                var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
                link.href = '#';
                link.title = 'Layers';
                
                // I believe this if/else controls the expansion of the controls
                if (L.Browser.touch) {
                    L.DomEvent
                        .on(link, 'click', L.DomEvent.stop)
                        .on(link, 'click', this._expand, this);
                }
                else {
                    L.DomEvent.on(link, 'focus', this._expand, this);
                }
                
                //Work around for Firefox android issue https://github.com/Leaflet/Leaflet/issues/2033
                L.DomEvent.on(form, 'click', function () {
                    setTimeout(L.bind(this._onInputClick, this), 0);
                }, this);
                
                // I believe this controls the collapse of the controls
                this._map.on('click', this._collapse, this);
            } else {
                // collapsed in the options dict is overridden to false
                this._expand();
            }
            */
            
            this._expand();
            this._baseLayersList = L.DomUtil.create('div', className + '-base', form);
            this._separator = L.DomUtil.create('div', className + '-separator', form);
            this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);
            
            container.appendChild(form);
        },
		
		_addHR: function() {
    var hr = document.createElement('hr');
    hr.className = 'legend-hr';
    var container = this._overlaysList;// : this._baseLayersList;
    container.appendChild(hr);
},

_update: function () {
    if (!this._container) {
        return;
    }

    this._baseLayersList.innerHTML = '';
    this._overlaysList.innerHTML = '';

    var baseLayersPresent = false,
        overlaysPresent = false,
        i, j, obj;
    
    for (i in this._layers) { j = i; }
    for (i in this._layers) {
        if (i === j) {
            this._addHR();
        }
        obj = this._layers[i];
        this._addItem(obj);
        overlaysPresent = overlaysPresent || obj.overlay;
        baseLayersPresent = baseLayersPresent || !obj.overlay;
    }

    this._separator.style.display = overlaysPresent && baseLayersPresent ? '' : 'none';
},

        
        _addItem: function (obj) {
            var label = document.createElement('label'),
                input,
                checked = this._map.hasLayer(obj.layer);
            
            // console.log(obj.overlay);
            
            if (obj.overlay) {
                input = document.createElement('input');
                input.type = 'checkbox';
                input.className = 'leaflet-control-layers-selector';
                input.defaultChecked = checked;
            } else {
                input = this._createRadioElement('leaflet-base-layers', checked);
            }

            input.layerId = L.stamp(obj.layer);
            L.DomEvent.on(input, 'click', this._onInputClick, this);
            
            var colourKey = document.createElement("i");
            colourKey.style.backgroundColor = ColorCondition(obj.name);
            // console.log(obj.name);
            
            var name = document.createElement('span');
            name.innerHTML = ' ' + obj.name;

            label.appendChild(input);
            label.appendChild(colourKey);
            label.appendChild(name);
            
            var container = obj.overlay ? this._overlaysList : this._baseLayersList;
            container.appendChild(label);

            return label;
        },
    })
   
    DrawComplete = L.Control.extend({
        options: {
            position: 'topleft'
        },
        onAdd: function () {
            var container = L.DomUtil.create('div', 'drawcomplete-control leaflet-bar leaflet-control');
            btn = L.DomUtil.create('a', 'drawcomplete-btn', container);
            btn.href = '#';
            btn.title = 'Make Cost Estimate';
            btn.innerHTML = '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>';
            L.DomEvent
                .on(btn, 'mousedown dblclick', L.DomEvent.stopPropagation)
                .on(btn, 'click', L.DomEvent.stop)
                .on(btn, 'click', function () {
                    var modal = $('#modal-repair');
                    
                    var lastEdited = editable.getLayers()[editable.getLayers().length-1];
                    var area = 0;
                    var len = 0;
                    
                    if ( lastEdited.options.type === 'cadtangle' ) {
                        latLngs = lastEdited.getLatLngs();
                        // console.log(latLngs);
                        // console.log(latLngs.slice(0,2).map(function(point){return [point.lat, point.lng]}));
                        area = L.GeometryUtil.geodesicArea(latLngs) * 1.195990046296;
                        len = getDistance(latLngs.slice(0,2).map(function(point){return [point.lat, point.lng]})) * 0.62137119;
                    } else {
                        switch ( lastEdited.toGeoJSON().geometry.type ) {
                            case 'Polygon':
                                area = L.GeometryUtil.geodesicArea(lastEdited.getLatLngs()) * 1.195990046296;
                                break;
                            case 'LineString':
                                len = getDistance(lastEdited.toGeoJSON().geometry.coordinates) * 0.62137119;
                                break;
                            default:
                                break;
                        }
                    }
                    
                    /*
                    area = Math.abs(editable.getLayers().filter(function (l) { return l.toGeoJSON().geometry.type === 'Polygon' }).reduce(function (prev, cur) {
                        return prev + L.GeometryUtil.geodesicArea(cur.getLatLngs())
                    }, 0) * 1.195990046296);
                    
                    len = editable.getLayers().filter(function (l) { return l.toGeoJSON().geometry.type === 'LineString' }).reduce(function (prev, cur) {
                        return prev + getDistance(cur.toGeoJSON().geometry.coordinates)
                    }, 0) * 0.62137119;
                    
                    len2 = editable.getLayers().filter(function (l) { return l.options.type === 'cadtangle' }).reduce(function (prev, cur) {
                        var curLen = cur.getLatLngs().slice(0,2).map(function(point){return [point.lat,point.lng]});
                        console.log(curLen);
                        return prev + getDistance(curLen)
                    }, 0) * 1.195990046296;
                    
                    len = Math.max(len, len2);
                    */
                    
                    
                    modal.find('.property-road-segment').text('').prop('contentEditable', true).addClass('form-control');
                    modal.find('.property-road-segment-condition').text('');
                    modal.find('.property-road-segment-federalaid').text('');
                    modal.find('.property-road-segment-act32').text('');
                    modal.find('.property-road-segment-length').text(numeral(len).format('0,0.00'));
                    modal.find('.property-road-segment-mcd').text('');
                    modal.find('.property-road-segment-owner').text('');
                    modal.find('.property-road-segment-cartway').text('');
					modal.find('.property-road-segment-liquidfuels').text('');      
					modal.find('.property-road-segment-road').text('');
                    modal.find('.property-road-segment-act32').text('');
                    modal.find('.property-road-segment-private').text('');
                    modal.find('.property-road-segment-area').text(numeral(area).format('0,0.00'));
                   // $(this).text(numeral(area * unitcost).format('$0,0.00'));
                    modal.find('.active').removeClass('active');
                    modal.find('.help-block').text('');
                    updateDefaultCostUnits();
                    updateRepairList( getEnabledRepairs() );
                    modal.modal('show');
                }, this);
            return container;
        }
    });
    
    roads = L.geoJson(null, {
        style: function (feature) {
            return {
                color: colors[+feature.properties.STRUCT_CON],
                weight: 2,
                opacity: 1
            }
        },
        onEachFeature: function (feature, layer) {
            layer.bindLabel(feature.properties.LR_STREET_ + ': ' + feature.properties.BEGIN_TERM + ' - ' + feature.properties.END_TERM_S)
        }
    }).on('mouseover', function(e){
        var layer = e.layer;
        var props = layer.feature.properties;
        layer.setStyle({
            weight: 5,
            color: 'blue',
            opacity: 1
        });
        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
    }).on('mouseout', function(e){
        var layer = e.layer;
        //return layer to back of map
        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToBack();
        }
        e.target.resetStyle(layer);
    }).on('click', function (e) {
        var modal = $('#modal-repair')
        modal.find('.property-road-segment').text(e.layer.feature.properties.LR_STREET_ + ': ' + e.layer.feature.properties.BEGIN_TERM + ' - ' + e.layer.feature.properties.END_TERM_S).prop('contentEditable', false).removeClass('form-control');
        modal.find('.property-road-segment-condition').text(condition[+e.layer.feature.properties.STRUCT_CON]);
        modal.find('.property-road-segment-federalaid').text(e.layer.feature.properties.IS_FED_AID);
        modal.find('.property-road-segment-length').text(numeral(e.layer.feature.properties.SEG_LENGTH).format('0,0.00'));
        modal.find('.property-road-segment-mcd').text(e.layer.feature.properties.MCD);
        modal.find('.property-road-segment-owner').text(e.layer.feature.properties.LR_OWNER_C);
        modal.find('.property-road-segment-cartway').text(e.layer.feature.properties.CARTWAY_WI);
        modal.find('.property-road-segment-road').text(e.layer.feature.properties.ROAD_TYPE_);
        modal.find('.property-road-segment-liquidfuels').text(e.layer.feature.properties.IS_LIQUID_);
		modal.find('.property-road-segment-act32').text(e.layer.feature.properties.ACT32);
        modal.find('.property-road-segment-private').text(e.layer.feature.properties.IS_PRIVATE);
        modal.find('.property-road-segment-area').text(numeral(e.layer.feature.properties.CARTWAY_WI / 3 * e.layer.feature.properties.SEG_LENGTH * 1760).format('0,0.00'))
        //modal.find('.property-road-segment-area').text(e.layer.feature.properties.CARTWAY_WI / 3 * e.layer.feature.properties.SEG_LENGTH * 1760);
        modal.find('.active').removeClass('active');
        modal.find('.help-block').text('');
        updateDefaultCostUnits();
        updateRepairList( getEnabledRepairs() );
        modal.modal('show');
    })
    
    mcd = L.geoJson(null, {
        style: function (feature) {
            return {
                color: 'purple',
                opacity: .7,
                fill: false,
                weight: 4,
                clickable: false
            }
        },
        onEachFeature: function (feature, layer) {
            L.marker([feature.properties.LAT, feature.properties.LONG], {
                icon: L.divIcon({
                    className: 'label-icon',
                    iconSize: [80, 20],
                    html: feature.properties.Mun_Label
                })
            }).addTo(map)
        }
    })
    
    mapLayers = function() {
        _layers = [];
        _layers.push( new L.Google('HYBRID', { styles: [{ "stylers": [{ "saturation": -100 }] }] }) );
        for (var i = 0; i < condition.length; i++) {
            _layers.push( $.extend(true, {}, roads) );
        }
        _layers.push( mcd );
        return _layers;
    };
    
    map = L.map('map', {
        center: [40.2837, -75.6143],
        zoom: 10,
        // layers: [
            // new L.Google('HYBRID', {
                // styles: [{
                    // "stylers": [{
                        // "saturation": -100
                    // }]
                // }]
            // }),
            // roads,
            // mcd
            // ]
        layers: mapLayers()
    }).fitBounds([[40.1675185812983, -75.7309824107495], [40.4007338308102, -75.4971735164997]]).on('moveend', function () {
      updateEncodedURL(map, [roads, editable])
    }).on('draw:deleted draw:edited', function (e) {
        editable.removeLayer(e.layer);
    }).on('draw:created draw:edited', function (e) {
        editable.addLayer(e.layer);
    }).on('draw:deleted draw:created draw:edited', function (e) {
        updateEncodedURL(map, [roads, editable]);
    });
    
    mapLayerLabels = function() {
        _labels = {};
        for (var i = 0; i < condition.length; i++) {
            _labels[ condition[i] ] = _layers[i+1];
        }
        _labels["Municipal Boundary"] = _layers[_layers.length - 1];
        return _labels;
    }
    
    layerControl = new LayerLegend( null, mapLayerLabels() ).addTo(map);
    
    roadSegments = [];
    roadShapesUser = L.geoJson(null, {
        }).on('mouseover', function(e){
            var layer = e.layer;
            if (!L.Browser.ie && !L.Browser.opera) {
                layer.bringToBack();
            }
            e.target.resetStyle(layer);
        }).on('mouseout', function(e){
            var layer = e.layer;
            if (!L.Browser.ie && !L.Browser.opera) {
                layer.bringToBack();
            }
            e.target.resetStyle(layer);
        }).addTo(map);
    
    editable = L.featureGroup().addTo(map);

    drawControl = new L.Control.Draw({
        position: 'topright',
        draw: {
		  cadtangle: {
                shapeOptions: {
                    color: '#FF6666'
                },
                metric: false,
                showArea: true
            },
            polyline: {
                shapeOptions: {
                    color: '#FF6666'
                },
                metric: false
            },
            polygon: {
                shapeOptions: {
                    color: '#FF6666'
                },
                metric: false,
                showArea: true
            },
            rectangle: false,
            circle: false,
            marker: false
        },
        edit: {
            featureGroup: editable,
			edit: false
		//	remove: false
        }
    }).addTo(map);

    map.addControl(new DrawComplete({position: 'topright'}));
    
    $.getJSON("data/mcd.js", function(data) {
        mcd.addData(data);
    });

    function compareYears(newYear, oldYear) {
        newYear = parseInt(newYear);
        oldYear = parseInt(oldYear);
        
        if (isNaN(newYear)) {
            return oldYear;
        }
        
        if (isNaN(oldYear)) {
            return newYear;
        }
        
        if (newYear > oldYear) {
            return newYear;
        } else {
            return oldYear;
        }
    }
    
    var roadCond = {};
    var roadRanking = {
        4 : "Excellent",
        3 : "Good",
        2 : "Fair",
        1 : "Poor",
        0 : "Unknown",
    };
    var adminAreas = [
        "Pottstown Borough",
        "Douglass Township",
        "Lower Pottsgrove Township",
        "New Hanover Township",
        "Upper Pottsgrove Township",
        "West Pottsgrove Township",
        "East Coventry Township",
        "North Coventry Township",
    ];
    var pieOptions = {
        segmentShowStroke : true,
        segmentStrokeColor : "#fff",
        segmentStrokeWidth : 2,
        percentageInnerCutout : 0,
        animateRotate : false,
        tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>%",
    };
    var tbl = $("#tabelle");
    var roadDict_mcd = {};
    var roadData = [];
    var inspectionYear = {};
    $.getJSON('data/local_roads.js', function (data, status, xhr) {
        var date = new Date(xhr.getResponseHeader('Last-Modified') || document.lastModified)
        roads.addData(data)
        for (var i = 0; i < condition.length; i++) {
            _layers[i+1].addData( filterRoadData( data, i ) );
        }
        // map.fitBounds(roads.getBounds())
        $('.page-last-modified').text([date.getMonth() + 1, date.getDate(), date.getFullYear()].join('/'))
        
        //// Format the admin area : road ranking : count associative array (Used in tabular format)
        $.each(adminAreas, function(key1, val1){
            roadDict_mcd[val1] = {};
            $.each(roadRanking, function(key2, val2){
                roadDict_mcd[val1][val2] = 0;
            });
        });
        
        //// Format the road ranking : count associative array (Used in pie chart)
        $.each(roadRanking, function(key, val){
            roadCond[val] = 0;
        });
        
        //// Format the admin area : inspection year associative array (Used in the table)
        $.each(adminAreas, function(key, val) {
            inspectionYear[val] = "-";
        });
        
        //// Read in JSON data
        $.each(data["features"], function(key, obj) {
            roadCond[roadRanking[parseInt(obj.properties.STRUCT_CON)]] += obj.properties.SEG_LENGTH;
            roadDict_mcd[obj.properties.MCD][roadRanking[parseInt(obj.properties.STRUCT_CON)]] += obj.properties.SEG_LENGTH;
            inspectionYear[obj.properties.MCD] = compareYears(obj.properties.INSPYEAR, inspectionYear[obj.properties.MCD]);
        });
    }).done(function() {
        //// Organise the data for chart.js pie chart and create it on the canvas
        var tempSum = 0;
        $.each(roadCond, function(key, val) {
            if (key != "Unknown") {
                console.log(tempSum, val);
                tempSum += val;
            }
        });
        $.each(roadRanking, function(index, val) {
            if (index != 0) {
                roadData.push({
                    value: (roadCond[val]*100/tempSum).toFixed(2),
                    color: colors[index],
                    highlight: colors[index],
                    label: val,
                });
            }
        });
        //  var myPie = new Chart(ctx).Pie(roadData, pieOptions);

        //// Push data onto table
        $.each(adminAreas, function(key1, val1) {
            var id = val1.replace(/ /g,"_");
            tbl.append("<div id='"+id+"' class='tabelle-row'></div>");
            
            var row = $("#tabelle #"+id);
            var rowsum = 0;
            row.append("<div class='cell cell_long'  style='text-align: left'>" + val1 + "</div>");
            if (isNaN(inspectionYear[val1])) {
                row.append("<div class='cell cell_short cell_border_left cell_border_right'>-</div>");
            } else {
                row.append("<div class='cell cell_short cell_border_left cell_border_right'>" + inspectionYear[val1] + "</div>");
            }
            $.each(roadRanking, function(key2, val2) {
                // Reorder hack...
                keyH = 4 - key2;
                valH = roadRanking[keyH];
                row.append("<div id='" + valH + "' class='cell cell_short'>" + roadDict_mcd[val1][valH].toFixed(2) + "</div>");
                rowsum += roadDict_mcd[val1][valH];
            });
            row.append("<div class='cell cell_short' style='font-weight: bold'>" + rowsum.toFixed(2) + "</div>");
        });

        tbl.append("<div id='xsum' class='tabelle-row' style='font-weight: bold'></div>");
        var row = $("#tabelle #xsum");
        var rowsum = 0;
        var ratedsum = 0;
        row.append("<div class='cell cell_long cell_border_top' style='font-weight: bold; text-align: right'>Region Total</div>");
        row.append("<div class='cell cell_short cell_border_top cell_border_left cell_border_right'>&nbsp;</div>");
        $.each(roadRanking, function(key, val) {
            // if (key != 4) {
            // Reorder hack...
            keyH = 4 - key;
            valH = roadRanking[keyH];
            row.append("<div id='" + valH + "' class='cell cell_short cell_border_top' style='font-weight: bold'>" + roadCond[valH].toFixed(2) + "</div>");
            rowsum += roadCond[valH];
            if (key != 4) {
                ratedsum += roadCond[valH];
            }
            
        });
        row.append("<div class='cell cell_short cell_border_top'>" + rowsum.toFixed(2) + "</div>");

        tbl.append("<div id='xpct' class='tabelle-row'></div>");
        var row = $("#tabelle #xpct");
       // row.append("<div class='cell cell_long'>Regional PCT</div>");
		row.append("<div class='cell cell_long'>&nbsp;</div>");
        row.append("<div class='cell cell_short cell_border_left cell_border_right'>&nbsp;</div>");
        $.each(roadRanking, function(key, val) {
            // if (key != 4) {
                // Reorder hack...
                keyH = 4 - key;
                valH = roadRanking[keyH];
                row.append("<div id='" + valH + "' class='cell cell_short'>" + (roadCond[valH]*100/rowsum).toFixed(2) + "%</div>");
            // } else {
                // row.append("<div class='cell cell_short'>&nbsp</div>");
            // }
        });
        row.append("<div class='cell cell_short'>&nbsp</div>");

        tbl.append("<div id='ypct' class='tabelle-row'></div>");
        var row = $("#tabelle #ypct");
      //  row.append("<div class='cell cell_long'>Rated PCT</div>");
		row.append("<div class='cell cell_long'>&nbsp;</div>");
        row.append("<div class='cell cell_short cell_border_left cell_border_right'>&nbsp;</div>");
        $.each(roadRanking, function(key, val) {
            if (key != 4) {
                // Reorder hack...
                keyH = 4 - key;
                valH = roadRanking[keyH];
                row.append("<div id='" + valH + "' class='cell cell_short' style='font-weight: bold'>" + (roadCond[valH]*100/ratedsum).toFixed(2) + "%</div>");
            } else {
                row.append("<div class='cell cell_short'>&nbsp</div>");
            }
        });
        row.append("<div class='cell cell_short'>&nbsp</div>");
    });
    
    $("a#clickSnapModal").on("mouseup", function(e) {
        setTimeout(function() {
            $("#canvas-injection").empty().append('<canvas id="pie-chart-area"></canvas>');
            var ctx = document.getElementById("pie-chart-area").getContext("2d");
            var myPie = new Chart(ctx).Pie(roadData, pieOptions);
        }, 400);
    });
    
    $(document).on('click', '[data-toggle="offcanvas"]', function () {
        $('.row-offcanvas').toggleClass('active')
    }).on('click', '.repair-type-list a', function (e) {
        // e.preventDefault()
        // $(this).parent('li').toggleClass('active').closest('.btn-group').next('.help-block');
        // treatments = $(this).closest('ul').find('.active').map(function () { return $(this).text() }).get();
        // costunits = getCostUnits();
        // costunits.push("0");
        // subtotals = getSubtotals( treatments, costunits );
        // updateRepairList( treatments, costunits, subtotals );
    }).on('click', '.btn-submit-repair', function (e) {
        e.preventDefault()
        var modal = $(this).closest('.modal').modal('hide');
        var segmentName = $.trim(modal.find('.property-road-segment').text()) || 'Untitled Road Segment';
        var enabledRepairs = getEnabledRepairs();
        var treatments = getTreatments( enabledRepairs );
        var costunits = getCostUnits( enabledRepairs );
        var subtotals = getSubtotals( enabledRepairs );
        var total = getTotal();
        
        roadSegments.push(new RoadSegment({
            roadSegment: segmentName,
            segmentLength: modal.find('.property-road-segment-length').text(),
            segmentArea: modal.find('.property-road-segment-area').text(),
            repairTypes: treatments,
            repairCostUnits: costunits,
            repairSubtotals: subtotals,
            repairTotal: total
        }))
        $('.list-repairs').append('<li class="list-group-item"><h4 class="list-group-item-heading">' + segmentName + '</h4><h4 class="list-group-item-heading">' + numeral(total).format('$0,0.00') + '</h4><p class="list-group-item-text">' + treatments.join(", ") + '</p></li>')
        updateDownloadURL(roadSegments)
        updateCostEstimate(roadSegments)
    }).on('dblclick', '.list-repairs>li', function () {
        if (confirm('Are you sure you want to delete this row?')) {
            roadSegments.splice([$(this).parent().find('li').index(this)], 1)
            $(this).remove()
            updateDownloadURL(roadSegments)
            updateCostEstimate(roadSegments)
        }
    }).on('click', '.list-repairs>li', function () {
        // <W?T>
        // Add in functionality to view the road segment (modal window) and other shit to modifiy and fuck around
        // </W?T>
    }).on('click', '.google-static-map-link', function (e) {
        if ($(this).prop('href').length > 2048) {
            e.preventDefault()
            alert('Please zoom in on a specific road segment first.')
        }
    }).on('focusout click keyup', '.costunit', function() {
        var enabledRepairs = getEnabledRepairs();
        updateRepairList( enabledRepairs );
    }).on('click', '.repair-enable', function() {
        var highlight_colour = "#D9EDF7"; //DVRPC Warm Color
        var highlight_colour = "rgb(217, 237, 247)"; //DVRPC Warm Color
        if (!$(this).prop("checked")) {
            $(this).parent().parent().css("background-color","rgb(255, 255, 255)");
            $(this).parent().parent().find(".costunit").prop('disabled',true);
        } else {
            $(this).parent().parent().css("background-color",highlight_colour);
            $(this).parent().parent().find(".costunit").prop('disabled',false);
        }
        // if (String($(this).parent().parent().css("background-color")) == highlight_colour) {
            // $(this).parent().parent().css("background-color","rgb(255, 255, 255)");
            // $(this).parent().parent().find(".costunit").prop('disabled',true);
        // } else {
            // $(this).parent().parent().css("background-color",highlight_colour);
            // $(this).parent().parent().find(".costunit").prop('disabled',false);
        // }
     var enabledRepairs = getEnabledRepairs();
        updateRepairList( enabledRepairs );
    }).on('click', '.clear', function(e) {
        roadSegments = [];
        updateDownloadURL(roadSegments);
        updateCostEstimate(roadSegments);
        updateRoadRepairList(roadSegments);
        
        roadShapesUser.eachLayer(function (l) {
            roadShapesUser.removeLayer(l);
        });
        editable.eachLayer(function(l) {
            editable.removeLayer(l);
        });
    }).on('click', '#menuEdit>#save', function() {
        var repairShapes = [];
        
        editable.eachLayer(function(l) {
            repairShapes.push(l.toGeoJSON());
        });
        roadShapesUser.eachLayer(function(l) {
            repairShapes.push(l.toGeoJSON());
        });
        
        localStorage.setItem('TAMRoadRepairs', JSON.stringify(roadSegments));
        localStorage.setItem('TAMRoadRepairShapes', JSON.stringify(repairShapes));
        
        // for (var x in localStorage) {
            // console.log( x + ":" + ((localStorage[x].length * 2)/1024).toFixed(3) + " KB");
        // }
    }).on('click', '#menuEdit>#load', function() {
        roadSegments = JSON.parse(localStorage.getItem('TAMRoadRepairs'));
        var repairShapes = JSON.parse(localStorage.getItem('TAMRoadRepairShapes'));
        
        updateDownloadURL(roadSegments);
        updateCostEstimate(roadSegments);
        updateRoadRepairList(roadSegments);
        
        roadShapesUser.eachLayer(function (l) {
            roadShapesUser.removeLayer(l);
        });
        roadShapesUser.addData( repairShapes );
        
    });
})


// Main function on page load
var mainLoad = function(){
	//create container and label on custom tool area
	$(".leaflet-top.leaflet-right").wrapInner("<div class='ctaWrapper'></div>").prepend("<div class='ctaTitle'><p>custom-area tools</p></div>");
	}
	
	$(document).ready(mainLoad);

