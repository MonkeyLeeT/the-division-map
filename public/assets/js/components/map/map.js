(function() {
    'use strict';

    angular.module('theDivisionAgent')
        .controller('MapController', MapController);

    MapController.$inject = ['$rootScope'];
    function MapController($rootScope){
        var vm = this;

        vm.filters = [
            { enabled: true, markerType: 'Checkpoints', icon: "/assets/img/icons/checkpoint.png",       name: "Checkpoints" },
            { enabled: true, markerType: 'DZEnterances', icon: "/assets/img/icons/dz-enterance.png",     name: "DZ Entrances" },
            { enabled: true, markerType: 'SafeHouses', icon: "/assets/img/icons/saferoom.png",         name: "Safe Houses" },
            { enabled: true, markerType: 'Extractions', icon: "/assets/img/icons/extraction.png",       name: "Extractions" },
            { enabled: true, markerType: 'Landmarks', icon: "/assets/img/icons/landmark-off.png",     name: "Landmarks" },
            { enabled: true, markerType: null, icon: "/assets/img/icons/subway.png",           name: "Subway Enterances", comingSoon: true },
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

        return vm;
    }


}());
