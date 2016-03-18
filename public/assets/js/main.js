var theDivisionMap = L.map('map-content', {
    center: [-70, 50],
    zoom: 4
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
    'Extractions':        new DivisionIcon({iconUrl: 'leaf-green.png'}),
    'SubwayEnterances':   new DivisionIcon({iconUrl: 'leaf-green.png'}),
    'Landmarks':          new DivisionIcon({iconUrl: '/assets/img/icons/landmark.png'}),
    'SafeHouses':         new DivisionIcon({iconUrl: 'leaf-green.png'}),
    'Checkpoints':        new DivisionIcon({iconUrl: '/assets/img/icons/checkpoint.png'}),
    'DZEnterance':        new DivisionIcon({iconUrl: '/assets/img/icons/dz-enterance.png'}),
    'Lootable': {
        'DivisionTech':   new DivisionIcon({iconUrl: 'leaf-green.png'}),
        'DarkzoneChests': new DivisionIcon({iconUrl: 'leaf-green.png'}),
    },
    'Enemy': {
        'Champions':      new DivisionIcon({iconUrl: 'leaf-green.png'}), // Named Bosses
        'Elites':         new DivisionIcon({iconUrl: 'leaf-green.png'}), // Yellow
        'Rares':          new DivisionIcon({iconUrl: 'leaf-green.png'})  // Purple
    }
};

//
// Markers
//

var Markers = [
    { type: "Checkpoints", label: "Checkpoint", locations: [
        {x: -78.5, y: 33.6}, // dz01 south entrance
        {x: -72.8, y: 83.8}, // dz01 east entrance
        {x: -72.8, y: -14.8}, // dz01 west entrance
    ]}
];

_.each(Markers, function(marker){
    var icon = _.get(Icons, marker.type);
    _.each(marker.locations, function(loc){
        var marker = L.marker([loc.x, loc.y], {icon: icon});
        // marker.bindPopup(marker.label);
        // marker.on('mouseover', function (e) {
        //     this.openPopup();
        // });
        // marker.on('mouseout', function (e) {
        //     this.closePopup();
        // });
        marker.addTo(theDivisionMap);
    });
});

//
// Polygons
//

var Areas = {
    dz01: [[0, 0],[40, 0],[0, 80]]
};

// var polygon = L.polygon(Areas.dz01, {clickable: false, weight: 1, fillOpacity: 0.1});
// polygon.addTo(theDivisionMap);
