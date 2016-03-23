(function() {
    'use strict';

    angular.module('theDivisionAgent')
        .controller('MapController', MapController);

    MapController.$inject = ['$scope', '$rootScope', '$stateParams', '$timeout', 'GoogleURLShortener'];
    function MapController($scope, $rootScope, $stateParams, $timeout, GoogleURLShortener){
        var vm = this;
        vm.zoomAtMin = false;
        vm.zoomAtMax = false;

        vm.initialized = false;
        $timeout(function(){ vm.initialized = true; }, 100);
        vm.menuCollapsed = ($rootScope.windowInnerWidth < 768);
        $scope.$on('window-resize', function(e, newWidth, oldWidth){
            if(newWidth < 768 && oldWidth >= 768){
                vm.menuCollapsed = true;
            } else if( newWidth >= 768 && oldWidth < 768 ) {
                vm.menuCollapsed = false;
            }
        });

        vm.filters = [
            { enabled: true, markerType: 'Checkpoints', icon: "/assets/img/icons/checkpoint.png",       name: "Checkpoints" },
            { enabled: true, markerType: 'DZEnterances', icon: "/assets/img/icons/dz-enterance.png",     name: "DZ Entrances" },
            { enabled: true, markerType: 'SafeHouses', icon: "/assets/img/icons/saferoom.png",         name: "Safe Houses" },
            { enabled: true, markerType: 'Extractions', icon: "/assets/img/icons/extraction.png",       name: "Extractions" },
            { enabled: true, markerType: 'Landmarks', icon: "/assets/img/icons/landmark-off.png",     name: "Landmarks" },
            { enabled: true, markerType: null, icon: "/assets/img/icons/subway.png",           name: "Subway Entrances", comingSoon: true },
            { enabled: true, markerType: null, icon: "/assets/img/icons/containment-zone.png", name: "Containment Zone", comingSoon: true },
            { enabled: true, markerType: 'Lootable.DivisionTech', icon: "/assets/img/icons/division-tech.png",    name: "Division Tech" },
            { enabled: true, markerType: "Lootable.DarkzoneChests", icon: "/assets/img/icons/darkzone-chest.png",   name: "Darkzone Chests"},
            { enabled: true, markerType: 'Enemy.Champions', icon: "/assets/img/icons/enemy-named.png",      name: "Enemy Champions" },
        ];

        vm.toggleFilter = function(filter){
            filter.enabled = !filter.enabled;
            if( filter.markerType !== null)
                $rootScope.$broadcast('map-switch-filter', filter.markerType, filter.enabled);
        };

        vm.toggleAllFilters = function(){
            var status = !_.find(vm.filters, {enabled: true});
            _.each(vm.filters, function(filter){
                filter.enabled = status;
                if( filter.markerType !== null )
                    $rootScope.$broadcast('map-switch-filter', filter.markerType, filter.enabled);
            });
        };

        vm.toggleMenu = function(){
            vm.menuCollapsed = !vm.menuCollapsed;
        };

        if($stateParams.path) {
            getShareableURL($stateParams.path);
            var points = $stateParams.path.split('_');
            points = _.map(points, function(pt){
                var latlng = pt.split(',');
                return [+latlng[0], +latlng[1]];
            });
            $timeout(function(){
                $rootScope.$broadcast('map-pathing-init', points);
            }, 100);
        }


        vm.pathing = false;
        vm.shareableUrl = null;
        var pathArray = [];
        vm.beginPathing = function(){
            vm.pathing = true;
            vm.shareableUrl = null;
            $rootScope.$broadcast('map-pathing', true);
        };
        vm.endPathing = function(){
            vm.pathing = false;
            $rootScope.$broadcast('map-pathing', false);

            var pathStr = "";
            _.each(pathArray, function(point){
                if(pathStr !== "")
                    pathStr = pathStr + "_";
                pathStr = pathStr + point[0] + "," + point[1];
            });
            getShareableURL(pathStr);
            pathArray = [];
        };

        function getShareableURL(pathStr){
            var longUrl = "http://thedivisionagent.com/map?path="+pathStr;
            GoogleURLShortener.shorten(longUrl).then(function(shortUrl){
                vm.shareableUrl = shortUrl;
            }, function(){
                vm.shareableUrl = "Error";
            });
        }

        $scope.$on('map-pathing-update', function(event, newPathArray){
            pathArray = newPathArray;
        });

        vm.zoomDecrease = function(){
            vm.zooming = true;
            $rootScope.$broadcast('map-decrease-zoom-level', function(atMinimumZoom, atMaximumZoom){
                vm.zoomAtMin = atMinimumZoom;
                vm.zoomAtMax = atMaximumZoom;
                vm.zooming = false;
            });
        };
        vm.zoomIncrease = function(){
            vm.zooming = true;
            $rootScope.$broadcast('map-increase-zoom-level', function(atMinimumZoom, atMaximumZoom){
                vm.zoomAtMin = atMinimumZoom;
                vm.zoomAtMax = atMaximumZoom;
                vm.zooming = false;
            });
        };

        return vm;
    }


}());
