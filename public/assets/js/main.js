var mymap = L.map('interactiveMap', {
    center: [0, 0],
    zoom: 0
});

L.tileLayer('/assets/img/map/{z}/{x}/{y}.png', {
    attribution: '',
    maxZoom: 2,
    minZoom: 0,
    tileSize: 256, // default
    noWrap: true
}).addTo(mymap);

// z = zoom, x = left -> right, y = top -> down
// 0/0/0
// 1/0/0, 1/0/1, 1/1/0, 1/1/1


//
// Drawing on the map!
//

// var marker = L.marker([51.5, -0.09]).addTo(mymap);
// var circle = L.circle([51.508, -0.11], 500, {color: 'red',fillColor: '#f03',fillOpacity: 0.5}).addTo(mymap);
// var polygon = L.polygon([[51.509, -0.08],[51.503, -0.06],[51.51, -0.047]]).addTo(mymap);



//
// Popups
//

// marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
// circle.bindPopup("I am a circle.");
// polygon.bindPopup("I am a polygon.");



//
// Events
//

// mymap.on('click', function(e) {
//     alert("You clicked the map at " + e.latlng);
// });



//
// Custom Icons
//

// var greenIcon = L.icon({
//     iconUrl: 'leaf-green.png',
//     shadowUrl: 'leaf-shadow.png',
//     iconSize:     [38, 95], // size of the icon
//     shadowSize:   [50, 64], // size of the shadow
//     iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
//     shadowAnchor: [4, 62],  // the same for the shadow
//     popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
// });
// L.marker([51.5, -0.09], {icon: greenIcon}).addTo(map);
