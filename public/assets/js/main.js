// var theDivisionMap = L.map('map-content', {
//     center: [-60, 20],
//     zoom: 3
// });
var theDivisionMap = L.map('map-content', {
    center: [50, -10],
    zoom: 4
});

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
        {x: 1.9,     y: -53,     label: "DZ03 Northwest Entrance"},
        {x: 1.9,     y: 67.5,    label: "DZ03 Northeast Entrance"},
        {x: -25.7,     y: 81.5,  label: "DZ03 Southeast Entrance"},
        {x: -36.80,  y: -40.00,  label: "DZ03 Southwest Checkpoint"},
        {x: 72.2,    y: -85.7,   label: "DZ06 West Checkpoint"},
        {x: 67.6,    y: 28.6,    label: "DZ06 East Checkpoint"},
        {x: 38,      y: 28.2,    label: "DZ05 East Checkpoint"},
        {x: 38.8,    y: -65.3,   label: "DZ05 West Checkpoint"},
    ]},
    { type: "DZEnterances", locations: [
        {x: -47.00,  y: 82.10,   label: "DZ02 East Entrance"},
        {x: -54.60,  y: -19.00,  label: "DZ02 West Entrance"},
        {x: -25.6,   y: -50,     label: "DZ03 West Entrance"},
        {x: 28,      y: -60.8,   label: "DZ03 West Entrance"},
        {x: -13.3,   y: 81.5,    label: "DZ03 East Entrance"},
        {x: 28,      y: -60.8,   label: "DZ04 West Entrance"},
        {x: 59,      y: 28.4,    label: "DZ05 East Entrance"},
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
        {x: 38.5,    y: -41,     label: "News Chopper Crash"},
        {x: 42,    y: -23,       label: "Scaffolding Collapse"},
        {x: 59,   y: 15.0,       label: "The Pit"},
        {x: 64.1,   y: -16,      label: "Mid Town Music"},
        {x: 70,   y: 6.5,        label: "Q Building"},
    ]},
    { type: "Extractions", locations: [
        {x: -70.00,  y: 65.00,  label: "Gas Station Extraction"},
        {x: -72.30,  y: -9.50,  label: "Subway Extraction"},
        {x: -51.60,  y: 12.10,  label: "Rooftop Extraction"},
        {x: -12.80,  y: -6.6,   label: "Bryant Park Extraction"},
        {x: 33,      y: 52.4,   label: ""},
        {x: 43.3,    y: -5.4,   label: ""},
        {x: 52.4,    y: -52,    label: ""},
        {x: 69.2,    y: -27.5,  label: ""},
    ]},
    { type: "SafeHouses", locations: [
        {x: -45.50,  y: 50.00,  label: "DZ02 Safe Room"},
        {x: -35.20,  y: -4.20,  label: "DZ03 Safe Room"},
        {x: 25.9,    y: -1.70,  label: "DZ04 Safe Room"},
        {x: 54.6,    y: -5.4,   label: "DZ05 Safe Room"},
        {x: 72.7,    y: -8,     label: "DZ06 Safe Room"},
    ]},
    { type: "Lootable.DivisionTech", locations: [
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
        {x: 8.80,  y: -50,   label: "????"},
        {x: 15.3,  y: -57,   label: "????"},
        {x: 9.5,   y: 53.6,  label: "????"},
        {x: 6.5,   y: 53.6,  label: "????"},
        {x: 13.5,  y: 68.6,  label: "????"},
        {x: 17.5,  y: 13,  label: "????"},
        {x: 29.5,  y: 28,  label: "????"},
        {x: 31,  y: 29,  label: "????"},
        {x: 32.5,  y: 28,  label: "????"},
        {x: 32.5,  y: 25,  label: "????"},
        {x: 34.5,  y: 34,  label: "????"},
        {x: 44.9,   y: 15.8,  label: "????"},
        {x: 52,   y: 9,  label: "????"},
        {x: 44.5, y: 0.5,  label: "???? - Above Ground"},
        {x: 42,   y: -2,  label: "???? - Above Ground"},
        {x: 37.5,    y: -41,     label: "????"},
        {x: 43.5,    y: -35,     label: "????"},
        {x: 48,    y: -62,     label: "????"},
        {x: 53,    y: -42,     label: "????"},
        {x: 57,    y: -42,     label: "????"},
        {x: 65.5,    y: -66.5,     label: "????"},
        {x: 71,    y: -66.5,     label: "????"},
        {x: 73,    y: -66.5,     label: "????"},
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
