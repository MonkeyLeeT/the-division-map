var theDivisionMap = L.map('map-content', {
    center: [0, 0],
    zoom: 2
});

L.tileLayer('/assets/img/map/{z}/{x}/{y}.png', {
    attribution: '',
    maxZoom: 4,
    minZoom: 0,
    tileSize: 256, // default
    noWrap: true,
    reuseTiles: true
}).addTo(theDivisionMap);

// z = zoom, x = left -> right, y = top -> down
//   256x256    - 1 images   -  0/0/0
//   512x512    - 4 images   -  1/0/0, 1/0/1, 1/1/0, 1/1/1
//   1024x1024  - 16 images  -  2/
//   2048x2048  - 64 images  -  3/
//   4096x4096  - 256 images -  4/


//
// Ours Special Icons
//

var DivisionIcon = L.Icon.extend({
    options: {
        iconSize:     [32, 32],
        iconAnchor:   [32, 32],
        popupAnchor:  [0, 0]
    }
});

var Icons = {
    Extractions:        new DivisionIcon({iconUrl: 'leaf-green.png'}),
    SubwayEnterances:   new DivisionIcon({iconUrl: 'leaf-green.png'}),
    Landmarks:          new DivisionIcon({iconUrl: 'leaf-green.png'}),
    SafeHouses:         new DivisionIcon({iconUrl: 'leaf-green.png'}),
    Checkpoints:        new DivisionIcon({iconUrl: 'leaf-green.png'}),
    Lootable: {
        DivisionTech:   new DivisionIcon({iconUrl: 'leaf-green.png'}),
        DarkzoneChests: new DivisionIcon({iconUrl: 'leaf-green.png'}),
    },
    Enemy: {
        Champions:      new DivisionIcon({iconUrl: 'leaf-green.png'}), // Named Bosses
        Elites:         new DivisionIcon({iconUrl: 'leaf-green.png'}), // Yellow
        Rares:          new DivisionIcon({iconUrl: 'leaf-green.png'})  // Purple
    }
};

//
// Markers
//

// var marker = L.marker([90, 180]);
// marker.bindPopup("Division Tech");
// marker.on('mouseover', function (e) {
//     this.openPopup();
// });
// marker.on('mouseout', function (e) {
//     this.closePopup();
// });
// marker.addTo(theDivisionMap);

//
// Polygons
//

var Areas = {
    dz01: [[0, 0],[40, 0],[0, 80]]
};

// var polygon = L.polygon(Areas.dz01, {clickable: false, weight: 1, fillOpacity: 0.1});
// polygon.addTo(theDivisionMap);

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
