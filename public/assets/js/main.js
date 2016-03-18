var theDivisionMap = L.map('map-content', {
    center: [-60, 20],
    zoom: 3
});
// var theDivisionMap = L.map('map-content', {
//     center: [-10, 20],
//     zoom: 4
// });

L.tileLayer('/assets/img/map/{z}/{x}/{y}.jpg', {
    attribution: '',
    maxZoom: 4,
    minZoom: 2,
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
        iconAnchor:   [16, 16],
        popupAnchor:  [0, -32]
    }
});

var Icons = {
    'Extractions':        new DivisionIcon({iconUrl: '/assets/img/icons/extraction.png'}),
    'SubwayEnterances':   new DivisionIcon({iconUrl: 'leaf-green.png'}),
    'Landmarks':          new DivisionIcon({iconUrl: '/assets/img/icons/landmark-off.png'}),
    'SafeHouses':         new DivisionIcon({iconUrl: '/assets/img/icons/saferoom.png'}),
    'Checkpoints':        new DivisionIcon({iconUrl: '/assets/img/icons/checkpoint.png'}),
    'DZEnterances':       new DivisionIcon({iconUrl: '/assets/img/icons/dz-enterance.png'}),
    'Containment':        new DivisionIcon({iconUrl: '/assets/img/icons/containment.png'}),
    'Lootable': {
        'DivisionTech':   new DivisionIcon({iconUrl: '/assets/img/icons/division-tech.png'}),
        'DarkzoneChests': new DivisionIcon({iconUrl: '/assets/img/icons/'}),
    },
    'Enemy': {
        'Champions':      new DivisionIcon({iconUrl: '/assets/img/icons/'}), // Named Bosses
        'Elites':         new DivisionIcon({iconUrl: '/assets/img/icons/'}), // Yellow
        'Rares':          new DivisionIcon({iconUrl: '/assets/img/icons/'})  // Purple
    }
};

//
// Markers
//

var Markers = [
    { type: "Checkpoints", locations: [
        {x: -78.32,  y: 32.20,   label: "DZ01 South Checkpoint"},
        {x: -75.95,  y: 82.70,   label: "DZ01 East Checkpoint"},
        {x: -75.75,  y: -17.50,  label: "DZ01 West Checkpoint"},
        {x: -62.10,  y: 82.10,   label: "DZ02 East Checkpoint"},
        {x: -61.90,  y: -15.20,  label: "DZ02 West Checkpoint"},
        {x: -36.80,  y: -40.00,  label: "DZ03 Southwest Checkpoint"},
    ]},
    { type: "DZEnterances", locations: [
        {x: -47.00,  y: 82.10,   label: "DZ02 East Entrance"},
        {x: -54.60,  y: -19.00,  label: "DZ02 West Entrance"},
    ]},
    { type: "Landmarks", locations: [
        {x: -72.30,  y: 28.00,   label: "Koreatown"},
        {x: -65.10,  y: 32.20,   label: "Blockade"},
        {x: -66.10,  y: 54.00,   label: "Abandoned Gas Station"},
        {x: -58.70,  y: 48.00,   label: "Construction Site"},
        {x: -41.80,  y: 25.30,   label: "Kalkesse Sporting Store"},
        {x: -41.80,  y: 67.00,   label: "The Library"},
        {x: -13.40,  y: 32.10,   label: "Refueling Station"},
        {x: 8.80,    y: -4.7,    label: "Arch Plaza"},
    ]},
    { type: "Extractions", locations: [
        {x: -70.00,  y: 65.00,  label: "Gas Station Extraction"},
        {x: -72.30,  y: -9.50,  label: "Subway Extraction"},
        {x: -51.60,  y: 12.10,  label: "Rooftop Extraction"},
        {x: -12.80,  y: -6.6,    label: "Bryant Park Extraction"},
    ]},
    { type: "SafeHouses", locations: [
        {x: -45.50,  y: 50.00,  label: "DZ02 Safe Room"},
        {x: -35.20,  y: -4.20,  label: "DZ03 Safe Room"},
        {x: 25.9,    y: -1.70,  label: "DZ04 Safe Room"},
    ]},
    { type: "Lootable.DivisionTech", locations: [
        {x: 9.5,    y: 51.8,  label: "Div Tech Room"},
        {x: 30.9,   y: 26.5,  label: "Div Tech Room"},
        {x: -63,    y: 34,    label: "On Scaffolding"},
        {x: -60.3,  y: 49.6,  label: "Second Floor"},
        {x: -57.0,  y: 49.6,  label: "Second Floor"},
        {x: -58.7,  y: 48.0,  label: "Third Floor"},
        {x: -53.5,  y: 77.0,  label: "????"},
        {x: -51.5,  y: 77.0,  label: "????"},
        {x: -53.5,  y: 74.0,  label: "????"},
        {x: -41.0,  y: 63.0,  label: "On Ground"},
        {x: -39.0,  y: 28,    label: "Third Floor: Behind Christmas Tree"},
        {x: -44.3,  y: 28,    label: "Second Floor: Billards Room"},
        {x: -44.7,  y: 20,    label: "Third Floor: On Scaffolding"},
        {x: -43.3,  y: 23,    label: "First Floor"},
        {x: -30,  y: 12.5,    label: "????"},
        {x: -30,  y: 2,       label: "????"},
        {x: -24,  y: 50,      label: "????"},
        {x: -13.4, y: 30.5,   label: "????"},
        {x: -6,  y: 6.5,      label: "????"},
        {x: 8.80,  y: -4.7,   label: "????"},
    ]},
];

_.each(Markers, function(marker){
    var icon = _.get(Icons, marker.type);
    _.each(marker.locations, function(loc){
        var marker = L.marker([loc.x, loc.y], {icon: icon});
        marker.bindPopup(loc.label);
        marker.on('mouseover', function (e) {
            this.openPopup();
        });
        marker.on('mouseout', function (e) {
            this.closePopup();
        });
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
