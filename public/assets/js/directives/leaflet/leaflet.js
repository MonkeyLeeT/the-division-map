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
                var STARTING_LAT = -60;
                var STARTING_LNG = 40;
                var ICON_SIZE = 32;
                var current_zoom = 3;
                var icon_scale = 1;
                var Icons = {};
                var Markers = {};

                // Create Map
                var theDivisionMap = L.map(attrs.id, { center: [STARTING_LAT, STARTING_LNG], zoom: current_zoom, zoomControl: false }); // Default

                // Add Mouse Position to bottom left of map
                L.control.mousePosition().addTo(theDivisionMap);

                // Define custom map
                L.tileLayer('/assets/img/map/{z}/{x}/{y}.jpg', {
                    attribution: '',
                    maxZoom: MAX_ZOOM,
                    minZoom: MIN_ZOOM,
                    noWrap: true,
                    reuseTiles: true
                }).addTo(theDivisionMap);

                // Build Icons
                buildIcons();

                // Build Markers
                buildMarkers();

                // Loop over all our markers and place them on the map
                _.each(Markers, function(marker){
                    var icon = _.get(Icons, marker.type);
                    _.each(marker.locations, function(loc){
                        loc.marker = L.marker([loc.lat, loc.long], {icon: icon});
                        if(DEBUG_MODE) {
                            loc.label = "("+loc.id+"): "+loc.label;
                        }
                        if(loc.label !== "") {
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

                //
                // Filter Markers
                //

                scope.$on('map-switch-filter', function(e, markerType, enabled){
                    _.each(_.find(Markers, {type: markerType}).locations, function(loc){
                        if(enabled)
                            loc.marker.addTo(theDivisionMap);
                        else
                            theDivisionMap.removeLayer(loc.marker);
                    });
                });

                //
                // Map Pathing
                //

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

                //
                // Custom Map Zoom
                //

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







                //
                // Special Icons
                //

                function buildIcons() {
                    var scaled_icon_size = ICON_SIZE * icon_scale;
                    var DivisionIcon = L.Icon.extend({
                        options: {
                            iconSize:     [scaled_icon_size, scaled_icon_size],
                            iconAnchor:   [(scaled_icon_size/2), (scaled_icon_size/2)],
                            popupAnchor:  [0, (0-scaled_icon_size)]
                        }
                    });

                    Icons = {
                        'Extractions':     new DivisionIcon({iconUrl: '/assets/img/icons/extraction.png'}),
                        'SubwayEntrances': new DivisionIcon({iconUrl: '/assets/img/icons/subway.png'}),
                        'Landmarks':       new DivisionIcon({iconUrl: '/assets/img/icons/landmark-off.png'}),
                        'SafeHouses':      new DivisionIcon({iconUrl: '/assets/img/icons/saferoom.png'}),
                        'Checkpoints':     new DivisionIcon({iconUrl: '/assets/img/icons/checkpoint.png'}),
                        'DZEntrances':     new DivisionIcon({iconUrl: '/assets/img/icons/dz-enterance.png'}),
                        'Containment':     new DivisionIcon({iconUrl: '/assets/img/icons/containment.png'}),
                        'DivisionTech':    new DivisionIcon({iconUrl: '/assets/img/icons/division-tech.png'}),
                        'DarkzoneChests':  new DivisionIcon({iconUrl: '/assets/img/icons/darkzone-chest.png'}),
                        'NamedBosses':     new DivisionIcon({iconUrl: '/assets/img/icons/enemy-named.png'}),
                    };
                }

                //
                // Markers
                //

                function buildMarkers() {
                    Markers = [
                        { type: "Checkpoints", locations: [
                            { id: 1,    lat: -78.32,  long: 32.20,   label: "DZ01 South Checkpoint"},
                            { id: 2,    lat: -75.95,  long: 82.70,   label: "DZ01 East Checkpoint"},
                            { id: 3,    lat: -75.75,  long: -17.50,  label: "DZ01 West Checkpoint"},
                            { id: 4,    lat: -62.10,  long: 82.10,   label: "DZ02 East Checkpoint"},
                            { id: 5,    lat: -61.90,  long: -15.20,  label: "DZ02 West Checkpoint"},
                            { id: 6,    lat: 1.9,     long: -53,     label: "DZ03 Northwest Entrance"},
                            { id: 7,    lat: 1.9,     long: 67.5,    label: "DZ03 Northeast Entrance"},
                            { id: 8,    lat: -25.7,   long: 81.5,    label: "DZ03 Southeast Entrance"},
                            { id: 9,    lat: -36.80,  long: -40.00,  label: "DZ03 Southwest Checkpoint"},
                            { id: 10,   lat: 67.7,    long: -80,     label: "DZ06 West Checkpoint"},
                            { id: 11,   lat: 67.6,    long: 28.6,    label: "DZ06 East Checkpoint"},
                            { id: 12,   lat: 38,      long: 28.2,    label: "DZ05 East Checkpoint"},
                            { id: 13,   lat: 38.8,    long: -65.3,   label: "DZ05 West Checkpoint"},
                        ]},
                        { type: "DZEntrances", locations: [
                            { id: 14,   lat: -47.00,  long: 82.10,   label: "DZ02 East Entrance"},
                            { id: 15,   lat: -54.60,  long: -19.00,  label: "DZ02 West Entrance"},
                            { id: 16,   lat: -25.6,   long: -47,     label: "DZ03 West Entrance"},
                            { id: 17,   lat: 28,      long: -60.8,   label: "DZ03 West Entrance"},
                            { id: 18,   lat: -13.3,   long: 81.5,    label: "DZ03 East Entrance"},
                            { id: 19,   lat: 28,      long: -60.8,   label: "DZ04 West Entrance"},
                            { id: 20,   lat: 59,      long: 28.4,    label: "DZ05 East Entrance"},
                        ]},
                        { type: "Landmarks", locations: [
                            { id: 21,   lat: -72.30,  long: 28.00,   label: "Koreatown"},
                            { id: 22,   lat: -65.10,  long: 32.20,   label: "Blockade"},
                            { id: 23,   lat: -66.10,  long: 54.00,   label: "Abandoned Gas Station"},
                            { id: 24,   lat: -58.70,  long: 48.00,   label: "Construction Site"},
                            { id: 25,   lat: -41.80,  long: 25.30,   label: "Kalkesse Sporting Store"},
                            { id: 26,   lat: -41.80,  long: 67.00,   label: "The Library"},
                            { id: 27,   lat: -13.40,  long: 32.10,   label: "Refueling Station"},
                            { id: 28,   lat: 8.80,    long: -4.7,    label: "Arch Plaza"},
                            { id: 29,   lat: 38.5,    long: -41,     label: "News Chopper Crash"},
                            { id: 30,   lat: 42,      long: -23,     label: "Scaffolding Collapse"},
                            { id: 31,   lat: 59,      long: 15.0,    label: "The Pit"},
                            { id: 32,   lat: 64.1,    long: -16,     label: "Mid Town Music"},
                            { id: 33,   lat: 70,      long: 6.5,     label: "Q Building"},
                        ]},
                        { type: "Extractions", locations: [
                            { id: 34,   lat: -70.00,  long: 65.00,  label: "Gas Station Extraction"},
                            { id: 35,   lat: -72.30,  long: -9.50,  label: "Subway Extraction"},
                            { id: 36,   lat: -51.60,  long: 12.10,  label: "Garage Rooftop Extraction"},
                            { id: 37,   lat: -12.80,  long: -6.6,   label: "Bryant Park Extraction"},
                            { id: 38,   lat: 33,      long: 52.4,   label: "Garage Rooftop Extraction"},
                            { id: 39,   lat: 43.3,    long: -5.4,   label: "Street Extraction"},
                            { id: 40,   lat: 52.4,    long: -52,    label: "Rooftop Extraction"},
                            { id: 41,   lat: 69.2,    long: -27.5,  label: "Hotel Rooftop Extraction"},
                        ]},
                        { type: "SafeHouses", locations: [
                            { id: 42,   lat: -45.50,  long: 50.00,  label: "DZ02 Safe Room"},
                            { id: 43,   lat: -35.20,  long: -4.20,  label: "DZ03 Safe Room"},
                            { id: 44,   lat: 25.9,    long: -1.70,  label: "DZ04 Safe Room"},
                            { id: 45,   lat: 54.6,    long: -5.4,   label: "DZ05 Safe Room"},
                            { id: 46,   lat: 72.7,    long: -8,     label: "DZ06 Safe Room"},
                        ]},
                        { type: "DivisionTech", locations: [
                            { id: 47,   lat: -63,     long: 34,     label: "On Scaffolding"},
                            { id: 48,   lat: -60.3,   long: 49.6,   label: "Second Floor"},
                            { id: 49,   lat: -57.0,   long: 49.6,   label: "Second Floor"},
                            { id: 50,   lat: -58.7,   long: 49.6,   label: "Middle of the building on 3rd Floor"}, //moved to the right, was overlapping the landmark icon
                            { id: 51,   lat: -53.5,   long: 77.0,   label: ""},
                            { id: 52,   lat: -51.5,   long: 77.0,   label: ""},
                            { id: 53,   lat: -53.5,   long: 74.0,   label: ""},
                            { id: 54,   lat: -41.0,   long: 63.0,   label: "On Ground"},
                            { id: 55,   lat: -39.0,   long: 28,     label: "Third Floor: Behind Christmas Tree"},
                            { id: 56,   lat: -44.3,   long: 28,     label: "Second Floor: Billards Room"},
                            { id: 57,   lat: -44.7,   long: 20,     label: "Third Floor: On Scaffolding"},
                            { id: 58,   lat: -43.3,   long: 23,     label: "First Floor"},
                            { id: 59,   lat: -30,     long: 12.5,   label: ""},
                            { id: 60,   lat: -30,     long: 2,      label: ""},
                            { id: 61,   lat: -24,     long: 50,     label: ""},
                            { id: 62,   lat: -13.4,   long: 30.5,   label: ""},
                            { id: 63,   lat: -6,      long: 6.5,    label: ""},
                            { id: 64,   lat: 8.80,    long: -4.7,   label: ""},
                            { id: 65,   lat: 8.80,    long: -50,    label: ""},
                            { id: 66,   lat: 15.3,    long: -57,    label: ""},
                            { id: 67,   lat: 9.5,     long: 53.6,   label: ""},
                            { id: 68,   lat: 6.5,     long: 53.6,   label: ""},
                            { id: 69,   lat: 13.5,    long: 68.6,   label: ""},
                            { id: 70,   lat: 19.6,    long: 16,     label: "By the truck in the middle"},
                            { id: 71,   lat: 29.5,    long: 28,     label: ""},
                            { id: 72,   lat: 31,      long: 29,     label: ""},
                            { id: 73,   lat: 32.5,    long: 28,     label: ""},
                            { id: 74,   lat: 32.5,    long: 25,     label: ""},
                            { id: 75,   lat: 34.5,    long: 34,     label: ""},
                            { id: 76,   lat: 44.9,    long: 15.8,   label: ""},
                            { id: 77,   lat: 50,      long: 9.9,    label: ""},
                            { id: 78,   lat: 44.5,    long: 0.5,    label: ""},
                            { id: 79,   lat: 42,      long: -2,     label: ""},
                            { id: 80,   lat: 37.5,    long: -41,    label: ""},
                            { id: 81,   lat: 43.5,    long: -35,    label: ""},
                            { id: 82,   lat: 48,      long: -62,    label: ""},
                            { id: 83,   lat: 53,      long: -42,    label: ""},
                            { id: 84,   lat: 57,      long: -42,    label: ""},
                            { id: 85,   lat: 65.5,    long: -66.5,  label: ""},
                            { id: 86,   lat: 71,      long: -66.5,  label: ""},
                            { id: 87,   lat: 73,      long: -66.5,  label: ""},
                            { id: 88,   lat: -74.8,   long: 54,     label: "Behind Cars"},
                            { id: 89,   lat: -70.3,   long: -15.2,  label: "By Bench"},
                            { id: 90,   lat: 50.5,    long: -31.1,  label: ""},
                            { id: 91,   lat: 55,      long: 3.8,    label: ""},
                            { id: 92,   lat: 59.2,    long: 20.3,   label: "Top of Stairs"}, // Near The Pit
                            { id: 93,   lat: -13.6,   long: 79.4,   label: ""},
                            { id: 94,   lat: 70,      long: -7,     label: ""},
                            { id: 95,   lat: 70,      long: -25.3,  label: ""},
                            { id: 96,   lat: 70,      long: -29.4,  label: ""},
                            { id: 97,   lat: 69.6,    long: -27.6,  label: ""},
                            { id: 98,   lat: 68.3,    long: -27.6,  label: ""},
                            { id: 99,   lat: 74,      long: -36,    label: ""},
                            { id: 100,  lat: 72.7,    long: -43.6,  label: ""},
                            { id: 101,  lat: 70.3,    long: -53.2,  label: ""},
                            { id: 102,  lat: 63.4,    long: 10.1,   label: ""},
                            { id: 103,  lat: 57.4,    long: -12.1,  label: "In Subway"},
                        ]},
                        { type: "DarkzoneChests", locations: [
                            { id: 104,  lat: -78.2,   long: 52.7,   label: "End of Alley"},
                            { id: 105,  lat: -65.15,  long: 29.6,   label: "Middle of blockade against building"},
                            { id: 106,  lat: -59.75,  long: 47.9,   label: "Middle of Building on 1st Floor"},
                            { id: 107,  lat: -43,     long: 25.2,   label: "Middle of Building on 2nd Floor"},
                            { id: 108,  lat: -42,     long: 63,     label: "Middle of area against building"},
                            { id: 109,  lat: -69.2,   long: -10.8,  label: "Against Wall in Subway"},
                            { id: 110,  lat: -63.1,   long: -6.7,   label: "Back of Subway"},
                            { id: 111,  lat: -46.6,   long: -29.5,  label: "End of Road"},
                            { id: 112,  lat: 18.9,    long: 18,     label: "Back of truck"},
                            { id: 113,  lat: -12.8,   long: -1.8,   label: ""},
                            { id: 114,  lat: 27,      long: 69,     label: ""},
                            { id: 115,  lat: -6,      long: 12.5,   label: "In Subway"},
                            { id: 116,  lat: -13.25,  long: -22.4,  label: "In Subway"},
                            { id: 117,  lat: 58.95,   long: 13.2,   label: "Middle of the pit against the west wall"},
                            { id: 118,  lat: 68.5,    long: 2.5,    label: ""},
                            { id: 119,  lat: 62.4,    long: -77.6,  label: "Behind the tent"},
                            { id: 120,  lat: 59,      long: -70,    label: "In a tent, back of truck"},
                            { id: 121,  lat: 64,      long: -20.3,  label: ""},
                            { id: 122,  lat: 72.4,    long: -49.6,  label: "Subway behind stairs"},
                        ]},
                        { type: "SubwayEntrances", locations: [
                            { id: 123,  lat: 68.5,    long: -68.5,  label: "<b>7th Ave station</b>"},
                            { id: 124,  lat: 72.6,    long: -65,    label: "<b>7th Ave station</b>"},
                            { id: 125,  lat: 71.7,    long: -65.8,  label: "<b>7th Ave station</b>"},
                            { id: 126,  lat: 71.66,   long: -42.5,  label: "<b>7th Ave station</b>"},
                            { id: 127,  lat: 61,      long: -26,    label: "<b>Concourse West entrance</b><br/>Access to 47-50th St Rockefeller Center station"},
                            { id: 128,  lat: 56.5,    long: -27,    label: "<b>Concourse West entrance</b><br/>Access to 47-50th St Rockefeller Center station"},
                            { id: 129,  lat: 55.2,    long:-17.1,   label: "<b>Concourse South entrance</b><br/>Access to 47-50th St Rockefeller Center station"},
                            { id: 130,  lat: 60,      long: 8.8,    label: "<b>Concourse East entrance</b><br/>Access to 47-50th St Rockefeller Center station"},
                            { id: 131,  lat: 58,      long: 8.8,    label: "<b>Concourse East entrance</b><br/>Access to 47-50th St Rockefeller Center station"},
                            { id: 132,  lat: 52,      long: 8.8,    label: "<b>Concourse East entrance</b><br/>Access to 47-50th St Rockefeller Center station"},
                            { id: 133,  lat: 60,      long: 12.5,   label: "<b>Concourse East entrance</b><br/>In the Pit<br/>Access to 47-50th St Rockefeller Center station"},
                            { id: 134,  lat: 58,      long: 12.5,   label: "<b>Concourse East entrance</b><br/>In the Pit<br/>Access to 47-50th St Rockefeller Center station"},
                            { id: 135,  lat: 54.25,   long: -26.7,  label: "<b>47-50th St Rockefeller Center station</b><br/>Access to Concourse"},
                            { id: 136,  lat: 47,      long: -28.2,  label: "<b>47-50th St Rockefeller Center station</b><br/>Access to Concourse"},
                            { id: 137,  lat: 45,      long: -21.2,  label: "<b>47-50th St Rockefeller Center station</b><br/>Access to Concourse"},
                            { id: 138,  lat: -2.5,    long: 23,     label: "<b>Public Library station</b><br/>Access to Bryant Park station"},
                            { id: 139,  lat: -1.8,    long: -1.8,   label: "<b>Public Library station</b><br/>Access to Bryant Park station"},
                            { id: 140,  lat: -1.8,    long: -17.5,  label: "<b>Bryant Park station</b><br/>Access to Public Library station"},
                            { id: 141,  lat: -1.8,    long: -32.5,  label: "<b>Bryant Park station</b><br/>Access to Public Library station"},
                            { id: 142,  lat: -11.5,   long: -38.5,  label: "<b>Bryant Park station</b><br/>Access to Public Library station"},
                            { id: 143,  lat: -23.6,   long: -28.2,  label: "<b>Bryant Park station</b><br/>Access to Public Library station"},
                            { id: 144,  lat: -23.6,   long: -17.2,  label: "<b>Bryant Park station</b><br/>Access to Public Library station"},
                            { id: 145,  lat: -60.9,   long: 3.3,    label: "<b>33rd St station"},
                            { id: 146,  lat: -63.0,   long: 2.1,    label: "<b>33rd St station"},
                            { id: 147,  lat: -71.5,   long: -20.2,  label: "<b>33rd St station"},
                            { id: 148,  lat: -71.8,   long: -14.9,  label: "<b>33rd St station"},
                            { id: 149,  lat: -75.0,   long: -6.6,   label: "<b>33rd St station"},
                        ]},
                        { type: "NamedBosses", locations: [
                            { id: 150,  lat: 17.5,    long: 19,     label: "<b>Named Bosses:</b><br/>Boomerang<br/>Hawkeye"}, // W 43rd St parking
                            { id: 151,  lat: -11.5,   long: 30.5,   label: "<b>Named Bosses:</b><br/>Short Fuse"}, // Refueling Station
                            { id: 152,  lat: -12.8,   long: -4,     label: "<b>Named Bosses:</b><br/>Animal<br/>Torch"}, // Bryant Park
                            { id: 153,  lat: -6,      long: 11,     label: "<b>(Subway) Named Bosses:</b><br/>McGrady<br/>Hundly<br/>O'Rourke"}, // Public Library Station (Subway)
                            { id: 154,  lat: 62.3,    long: -70.3,  label: "<b>Named Bosses:</b><br/>Hardaway<br/>McGrady<br/>Claxton<br/>Draxler<br/>O'Rourke<br/>Hundly"}, // Containment zone next to DZ06 West Entrance
                            { id: 155,  lat: 27.3,    long: 59.5,   label: "<b>Named Bosses:</b><br/>Hardaway<br/>Greenberg<br/>Claxton"}, // Containment zone East 45th St
                            { id: 156,  lat: -77,     long: 52.7,   label: "<b>Named Bosses:</b><br/>Bonnie<br/>Dropkick<br/>Cowboy"}, // South Spawn (no landmark)
                            { id: 157,  lat: -66.9,   long: -6.7,   label: "<b>(Subway) Named Bosses:</b><br/>Claxton<br/>Hardaway"}, // 33rd St station
                            { id: 158,  lat: -66.9,   long: 31.8,   label: "<b>Named Bosses:</b><br/>Buckshot<br/>Scrapper<br/>Dropkick"}, // Blockade
                            { id: 159,  lat: -57.2,   long: 46.5,   label: "<b>Named Bosses:</b><br/>Hot Rod<br/>Baz<br/>Animal"}, // 34th St Construction Site
                            { id: 160,  lat: -46.86,  long: -23,    label: "<b>Named Bosses:</b><br/>Mazeroski<br/>???"},
                            { id: 161,  lat: -41.7,   long: 27.9,   label: "<b>Named Bosses:</b><br/>Zeke<br/>Animal"}, // Kalkesse Sporting Store
                            { id: 162,  lat: -42,     long: 60.8,   label: "<b>Named Bosses:</b><br/>Cannibal<br/>Boomerang<br/>Animal"}, // The Library
                            { id: 163,  lat: -13,     long: -25.3,  label: "<b>(Subway) Named Bosses:</b>"}, // Bryant Park Station (Subway)
                            { id: 164,  lat: 30,      long: -50,    label: "<b>Named Bosses:</b>"},
                            { id: 165,  lat: 39.2,    long: -23.2,  label: "<b>Named Bosses:</b>"},
                            { id: 166,  lat: 59,      long: 17.5,   label: "<b>Named Bosses:</b><br/>Cpt.Wilson<br/>Cpt.Carter<br/>Sgt.Thompson<br/>"}, // The Pit
                            { id: 167,  lat: 62.3,    long: -23,    label: "<b>Named Bosses:</b><br/>Shadow<br/>Cpt.Bryant"}, // Mid Town Music
                            { id: 168,  lat: 72.15,   long: -59.3,  label: "<b>(Subway) Named Bosses:</b><br/>Greenberg<br/>Coveleski"}, // 7th Ave Station (Subway)
                            { id: 169,  lat: 70.0,    long: 0,      label: "<b>Named Bosses:</b><br/>Coveleski"}, // Q Building
                            { id: 170,  lat: 45,      long: -28.2,  label: "<b>(Subway) Named Bosses:</b><br/>Barkley"}, // 47-50th St Rockefeller Center station (Subway)
                        ]}
                    ];
                }
            }
        };
    }
}());


// ||===========================================================================||
// ||  [Boss Name]    || [Archtype]      || [Faction]  || [Confirmed HE Drops]  ||
// ||===========================================================================||
// ||  Animal         ||  Tank           ||  Riker     ||
// ||  Barkley        ||  Controller     ||  Cleaner   ||
// ||  Baz            ||  Leader         ||  Riker     || Socom M1A
// ||  Bonnie         ||  Special        ||  Rioter    ||
// ||  Boomerang      ||  Sniper         ||  Riker     ||
// ||  Buckshot       ||  Sniper         ||  Rioter    ||
// ||  Cannibal       ||  Tank           ||  Riker     ||
// ||  Claxton        ||  Engineer       ||  Cleaner   ||
// ||  Coveleski      ||  Sniper         ||  Cleaner   ||
// ||  Cpt. Wilson    ||  Sniper         ||  LMB       ||
// ||  Cpt. Bryant    ||                 ||  LMB       ||
// ||  Cpt. Carter    ||  Leader         ||  LMB       ||
// ||  Draxler        ||                 ||            ||
// ||  Dropkick       ||  Heavy Weapons  ||  Rioter    ||
// ||  Greenberg      ||                 ||            ||
// ||  Hardaway       ||  Tank           ||  Cleaner   ||
// ||  Hawkeye        ||  Sniper         ||  Riker     || Midas
// ||  Hot Rod        ||                 ||            ||
// ||  Hundly         ||  Sniper         ||  Cleaner   || M1911
// ||  Mazeroski      ||                 ||            ||
// ||  McGrady        ||                 ||            ||
// ||  O'Rourke       ||  Tank           ||  Cleaner   ||
// ||  Scrapper       ||  Heavy Weapons  ||  Rioter    ||
// ||  Sgt. Thompson  ||  Heavy Weapons  ||  LMB       ||
// ||  Shadow         ||  Special        ||  LMB       ||
// ||  Short Fuse     ||  Leader         ||  Riker     ||
// ||  Torch          ||  Thrower        ||  Riker     ||
// ||  Zeke           ||  Tank           ||  Riker     ||
// ||===========================================================================||
