(function() {
    'use strict';

    angular.module('theDivisionAgent')
        .directive('leaflet', MapDirective);

    MapDirective.$inject = ['$rootScope'];
    function MapDirective($rootScope){
        return {
            restrict: 'E',
            replace: true,
            template: '<div></div>',
            link: function(scope, elem, attrs){
                var DEBUG_MODE = false;
                var MAX_ZOOM = 4;
                var MIN_ZOOM = 2;
                var current_zoom = 3;

                var theDivisionMap = L.map(attrs.id, { center: [-60, 40], zoom: current_zoom, zoomControl: false }); // Default
                // var theDivisionMap = L.map(attrs.id, { center: [60, -10], zoom: 4, zoomControl: false }); // Testing

                L.control.mousePosition().addTo(theDivisionMap);
                L.tileLayer('/assets/img/map/{z}/{x}/{y}.jpg', {
                    attribution: '',
                    maxZoom: MAX_ZOOM,
                    minZoom: MIN_ZOOM,
                    noWrap: true,
                    reuseTiles: true
                }).addTo(theDivisionMap);

                //
                // Special Icons
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
                    'SubwayEnterances':   new DivisionIcon({iconUrl: '/assets/img/icons/subway.png'}),
                    'Landmarks':          new DivisionIcon({iconUrl: '/assets/img/icons/landmark-off.png'}),
                    'SafeHouses':         new DivisionIcon({iconUrl: '/assets/img/icons/saferoom.png'}),
                    'Checkpoints':        new DivisionIcon({iconUrl: '/assets/img/icons/checkpoint.png'}),
                    'DZEnterances':       new DivisionIcon({iconUrl: '/assets/img/icons/dz-enterance.png'}),
                    'Containment':        new DivisionIcon({iconUrl: '/assets/img/icons/containment.png'}),
                    'Lootable': {
                        'DivisionTech':   new DivisionIcon({iconUrl: '/assets/img/icons/division-tech.png'}),
                        'DarkzoneChests': new DivisionIcon({iconUrl: '/assets/img/icons/darkzone-chest.png'}),
                    },
                    'Enemy': {
                        'Champions':      new DivisionIcon({iconUrl: '/assets/img/icons/enemy-named.png'}),
                        'Elites':         new DivisionIcon({iconUrl: '/assets/img/icons/enemy-champion.png'}),
                        'Rares':          new DivisionIcon({iconUrl: '/assets/img/icons/enemy-rare.png'})
                    }
                };

                //
                // Markers
                //

                var Markers = [
                    { type: "Checkpoints", locations: [
                        {lat: -78.32,  long: 32.20,   label: "DZ01 South Checkpoint"},
                        {lat: -75.95,  long: 82.70,   label: "DZ01 East Checkpoint"},
                        {lat: -75.75,  long: -17.50,  label: "DZ01 West Checkpoint"},
                        {lat: -62.10,  long: 82.10,   label: "DZ02 East Checkpoint"},
                        {lat: -61.90,  long: -15.20,  label: "DZ02 West Checkpoint"},
                        {lat: 1.9,     long: -53,     label: "DZ03 Northwest Entrance"},
                        {lat: 1.9,     long: 67.5,    label: "DZ03 Northeast Entrance"},
                        {lat: -25.7,   long: 81.5,    label: "DZ03 Southeast Entrance"},
                        {lat: -36.80,  long: -40.00,  label: "DZ03 Southwest Checkpoint"},
                        {lat: 67.7,    long: -80,   label: "DZ06 West Checkpoint"},
                        {lat: 67.6,    long: 28.6,    label: "DZ06 East Checkpoint"},
                        {lat: 38,      long: 28.2,    label: "DZ05 East Checkpoint"},
                        {lat: 38.8,    long: -65.3,   label: "DZ05 West Checkpoint"},
                    ]},
                    { type: "DZEnterances", locations: [
                        {lat: -47.00,  long: 82.10,   label: "DZ02 East Entrance"},
                        {lat: -54.60,  long: -19.00,  label: "DZ02 West Entrance"},
                        {lat: -25.6,   long: -47,     label: "DZ03 West Entrance"},
                        {lat: 28,      long: -60.8,   label: "DZ03 West Entrance"},
                        {lat: -13.3,   long: 81.5,    label: "DZ03 East Entrance"},
                        {lat: 28,      long: -60.8,   label: "DZ04 West Entrance"},
                        {lat: 59,      long: 28.4,    label: "DZ05 East Entrance"},
                    ]},
                    { type: "Landmarks", locations: [
                        {lat: -72.30,  long: 28.00,   label: "Koreatown"},
                        {lat: -65.10,  long: 32.20,   label: "Blockade"},
                        {lat: -66.10,  long: 54.00,   label: "Abandoned Gas Station"},
                        {lat: -58.70,  long: 48.00,   label: "Construction Site"},
                        {lat: -41.80,  long: 25.30,   label: "Kalkesse Sporting Store"},
                        {lat: -41.80,  long: 67.00,   label: "The Library"},
                        {lat: -13.40,  long: 32.10,   label: "Refueling Station"},
                        {lat: 8.80,    long: -4.7,    label: "Arch Plaza"},
                        {lat: 38.5,    long: -41,     label: "News Chopper Crash"},
                        {lat: 42,      long: -23,     label: "Scaffolding Collapse"},
                        {lat: 59,      long: 15.0,    label: "The Pit"},
                        {lat: 64.1,    long: -16,     label: "Mid Town Music"},
                        {lat: 70,      long: 6.5,     label: "Q Building"},
                    ]},
                    { type: "Extractions", locations: [
                        {lat: -70.00,  long: 65.00,  label: "Gas Station Extraction"},
                        {lat: -72.30,  long: -9.50,  label: "Subway Extraction"},
                        {lat: -51.60,  long: 12.10,  label: "Rooftop Extraction"},
                        {lat: -12.80,  long: -6.6,   label: "Bryant Park Extraction"},
                        {lat: 33,      long: 52.4,   label: "Street Extraction"},
                        {lat: 43.3,    long: -5.4,   label: "Street Extraction"},
                        {lat: 52.4,    long: -52,    label: "Rooftop Extraction"},
                        {lat: 69.2,    long: -27.5,  label: "Rooftop Extraction"},
                    ]},
                    { type: "SafeHouses", locations: [
                        {lat: -45.50,  long: 50.00,  label: "DZ02 Safe Room"},
                        {lat: -35.20,  long: -4.20,  label: "DZ03 Safe Room"},
                        {lat: 25.9,    long: -1.70,  label: "DZ04 Safe Room"},
                        {lat: 54.6,    long: -5.4,   label: "DZ05 Safe Room"},
                        {lat: 72.7,    long: -8,     label: "DZ06 Safe Room"},
                    ]},
                    { type: "Lootable.DivisionTech", locations: [
                        {lat: -63,    long: 34,    label: "On Scaffolding"},
                        {lat: -60.3,  long: 49.6,  label: "Second Floor"},
                        {lat: -57.0,  long: 49.6,  label: "Second Floor"},
                        {lat: -58.7,  long: 48.0,  label: "Third Floor"},
                        {lat: -53.5,  long: 77.0,  label: ""},
                        {lat: -51.5,  long: 77.0,  label: ""},
                        {lat: -53.5,  long: 74.0,  label: ""},
                        {lat: -41.0,  long: 63.0,  label: "On Ground"},
                        {lat: -39.0,  long: 28,    label: "Third Floor: Behind Christmas Tree"},
                        {lat: -44.3,  long: 28,    label: "Second Floor: Billards Room"},
                        {lat: -44.7,  long: 20,    label: "Third Floor: On Scaffolding"},
                        {lat: -43.3,  long: 23,    label: "First Floor"},
                        {lat: -30,    long: 12.5,    label: ""},
                        {lat: -30,    long: 2,       label: ""},
                        {lat: -24,    long: 50,      label: ""},
                        {lat: -13.4,  long: 30.5,   label: ""},
                        {lat: -6,     long: 6.5,      label: ""},
                        {lat: 8.80,   long: -4.7,   label: ""},
                        {lat: 8.80,   long: -50,   label: ""},
                        {lat: 15.3,   long: -57,   label: ""},
                        {lat: 9.5,    long: 53.6,  label: ""},
                        {lat: 6.5,    long: 53.6,  label: ""},
                        {lat: 13.5,   long: 68.6,  label: ""},
                        {lat: 19.6,   long: 16,  label: "By the truck in the middle"},
                        {lat: 29.5,   long: 28,  label: ""},
                        {lat: 31,     long: 29,  label: ""},
                        {lat: 32.5,   long: 28,  label: ""},
                        {lat: 32.5,   long: 25,  label: ""},
                        {lat: 34.5,   long: 34,  label: ""},
                        {lat: 44.9,   long: 15.8,  label: ""},
                        {lat: 52,     long: 9,  label: ""},
                        {lat: 44.5,   long: 0.5,  label: ""},
                        {lat: 42,     long: -2,  label: ""},
                        {lat: 37.5,   long: -41,     label: ""},
                        {lat: 43.5,   long: -35,     label: ""},
                        {lat: 48,     long: -62,     label: ""},
                        {lat: 53,     long: -42,     label: ""},
                        {lat: 57,     long: -42,     label: ""},
                        {lat: 65.5,   long: -66.5,     label: ""},
                        {lat: 71,     long: -66.5,     label: ""},
                        {lat: 73,     long: -66.5,     label: ""},
                        {lat: -74.8,     long: 54,     label: "Behind Cars"},
                        {lat: -70.3,     long: -15.2,     label: "By Bench"},
                        {lat: 50.5,     long: -31.1,     label: ""},
                        {lat: 55,     long: 3.8,     label: ""},
                        {lat: 59.5,     long: 17.75,     label: ""},
                        {lat: -13.6,     long: 79.4,     label: ""},
                        {lat: 70,     long: -7,     label: ""},
                        {lat: 70,     long: -25.3,     label: ""},
                        {lat: 70,     long: -29.4,     label: ""},
                        {lat: 69.6,     long: -27.6,     label: ""},
                        {lat: 68.3,     long: -27.6,     label: ""},
                        {lat: 74,     long: -36,     label: ""},
                        {lat: 72.7,     long: -43.6,     label: ""},
                        {lat: 70.3,     long: -53.2,     label: ""},
                        {lat: 63.4,     long: 10.1,     label: ""},
                    ]},
                    { type: "Lootable.DarkzoneChests", locations: [
                        {lat: -78.2,     long: 52.7,     label: "End of Alley"},
                        {lat: -65.15,     long: 29.6,     label: "Middle of blockade against building"},
                        {lat: -59.75,     long: 47.9,     label: "Middle of Building on 1st Floor"},
                        {lat: -43,     long: 25.2,     label: "Middle of Building on 2nd Floor"},
                        {lat: -42,     long: 63,     label: "Middle of area against building"},
                        {lat: -69.2,     long: -10.8,     label: "Against Wall in Subway"},
                        {lat: -63.1,     long: -6.7,     label: "Back of Subway"},
                        {lat: -46.6,     long: -29.5,     label: "End of Road"},
                        {lat: 18.9,     long: 18,     label: "Back of truck"},
                        {lat: -12.8,  long: -1.8,    label: ""},
                        {lat: 27,     long: 69,     label: ""},
                        {lat: -6,     long: 12.5,     label: "In Subway"},
                        {lat: -13.25,     long: -22.4,     label: "In Subway"},
                        {lat: 58.95,     long: 13.2,     label: ""},
                        {lat: 68.5,     long: 2.5,     label: ""},
                        {lat: 62.4,     long: -77.6,     label: "Behind the tent"},
                        {lat: 62.3,     long: -19.4,     label: ""},
                        {lat: 72.4,     long: -49.6,     label: "Subway behind stairs"},
                    ]},
                    { type: "SubwayEnterances", locations: [
                        {lat: 68.5,  long: -68.5,    label: "7th Ave Station Underground Entrance"},
                        {lat: 72.6,  long: -65,    label: "7th Ave Station Underground Entrance"},
                        {lat: 71.7,  long: -65.8,    label: "7th Ave Station Underground Entrance"},
                        {lat: 71.66,  long: -42.5,    label: "7th Ave Station Underground Entrance"},
                    ]},
                    { type: "Enemy.Champions", locations: [
                        {lat: 17.5,  long: 19,     label: "<b>Named Bosses:</b><br/>Boomerang<br/>Hawkeye"},
                        {lat: -11.5,  long: 30.5,  label: "<b>Named Bosses:</b><br/>Short Fuse"}, // Refueling Station
                        {lat: -12.8,  long: -4,    label: "<b>Named Bosses:</b><br/>Animal<br/>Torch"}, // Bryant Park
                        {lat: -6,  long: 11,       label: "<b>(Subway) Named Bosses:</b><br/>McGrady"},
                        {lat: 62.3,  long: -70.3,  label: "<b>Named Bosses:</b><br/>Draxler<br/>O'Rourke"},
                        {lat: 27.3,  long: 59.5,   label: "<b>Named Bosses:</b><br/>Hardaway<br/>Greenberg"},
                        {lat: -77,     long: 52.7,       label: "<b>Named Bosses:</b>"},
                        {lat: -66.9,     long: -6.7,     label: "<b>(Subway) Named Bosses:</b>"},
                        {lat: -66.9,     long: 31.8,     label: "<b>Named Bosses:</b>"},
                        {lat: -57.2,     long: 46.5,     label: "<b>Named Bosses:</b><br/>Hot Rod"},
                        {lat: -46.86,     long: -23,     label: "<b>Named Bosses:</b><br/>Mazeroski"},
                        {lat: -41.7,     long: 27.9,     label: "<b>Named Bosses:</b>"},
                        {lat: -42,     long: 60.8,     label: "<b>Named Bosses:</b>"},
                        {lat: -13,     long: -25.3,     label: "<b>(Subway) Named Bosses:</b>"},
                        {lat: 30,     long: -50,     label: "<b>Named Bosses:</b>"},
                        {lat: 39.2,     long: -23.2,     label: "<b>Named Bosses:</b>"},
                        {lat: 56.8,     long: 18.5,     label: "<b>Named Bosses:</b>"},
                        {lat: 62.3,     long: -17.5,     label: "<b>Named Bosses:</b>"},
                        {lat: 72.15,     long: -59.3,     label: "<b>Named Bosses:</b><br/>Greenberg"},
                        {lat: 70.0,     long: 10.7,     label: "<b>Named Bosses:</b>"},
                    ]}
                ];

                // Claxton = Cleaner Engineer

                _.each(Markers, function(marker){
                    var icon = _.get(Icons, marker.type);
                    _.each(marker.locations, function(loc){
                        loc.marker = L.marker([loc.lat, loc.long], {icon: icon});
                        if(loc.label !== ""){
                            loc.marker.bindPopup(loc.label);
                            loc.marker.on('mouseover', function (e) {
                                this.openPopup();
                            });
                            loc.marker.on('mouseout', function (e) {
                                this.closePopup();
                            });
                        }
                        loc.marker.on('click', function(e){
                            mapPointClicked(e);
                        });
                        loc.marker.addTo(theDivisionMap);
                    });
                });

                scope.$on('map-switch-filter', function(e, markerType, enabled){
                    _.each(_.find(Markers, {type: markerType}).locations, function(loc){
                        if(enabled)
                        loc.marker.addTo(theDivisionMap);
                        else
                        theDivisionMap.removeLayer(loc.marker);
                    });
                });

                var enabledPathing = false;
                var pathArray = [];
                var pathPolygons = [];

                scope.$on('map-pathing', function(e, enabled){
                    enabledPathing = enabled;
                    if(enabled){
                        _.each(pathPolygons, function(poly){
                            theDivisionMap.removeLayer(poly);
                        });
                        pathArray = [];
                        pathPolygons = [];
                    }
                });

                // attaching function on map click
                theDivisionMap.on('click', mapPointClicked);

                function mapPointClicked(e){
                    if(enabledPathing){
                        var lat = e.latlng.lat.toFixed(1);
                        var lng = e.latlng.lng.toFixed(1);
                        plotPolyLine(lat, lng);
                    }
                }

                function plotPolyLine(lat, lng){
                    var lastPoint = pathArray.length > 0 ? pathArray[pathArray.length-1] : null;
                    if( lastPoint === null || !(lastPoint[0] === lat && lastPoint[1] === lng) ){
                        pathArray.push([lat,lng]);
                        $rootScope.$broadcast('map-pathing-update', pathArray);

                        if(lastPoint === null){
                            lastPoint = [lat,lng];
                        }

                        var pointA = new L.LatLng(lastPoint[0], lastPoint[1]); // Last Point
                        var pointB = new L.LatLng(lat, lng); // New Point
                        var polyline = new L.Polyline([pointA, pointB], {
                            color: 'yellow',
                            weight: 5,
                            opacity: 0.5,
                            smoothFactor: 1
                        });
                        polyline.addTo(theDivisionMap);
                        pathPolygons.push(polyline);
                    }
                }

                scope.$on('map-pathing-init', function(e, pointArray){
                    _.each(pointArray, function(point){
                        plotPolyLine(point[0], point[1]);
                    });
                });

                scope.$on('map-increase-zoom-level', function(e, callback){
                    if( current_zoom < MAX_ZOOM ) {
                        current_zoom = current_zoom + 1;
                        theDivisionMap.setZoom(current_zoom);
                        callback(e, current_zoom === MIN_ZOOM, current_zoom === MAX_ZOOM);
                    }
                });

                scope.$on('map-decrease-zoom-level', function(e, callback){
                    if( current_zoom > MIN_ZOOM ) {
                        current_zoom = current_zoom - 1;
                        theDivisionMap.setZoom(current_zoom);
                        callback(e, current_zoom === MIN_ZOOM, current_zoom === MAX_ZOOM);
                    }
                });

                theDivisionMap.on('zoomend', function(e){
                    current_zoom = e.target._zoom;
                    $rootScope.$broadcast('map-zoom-changed', current_zoom === MIN_ZOOM, current_zoom === MAX_ZOOM);
                });
            }
        };
    }
}());
