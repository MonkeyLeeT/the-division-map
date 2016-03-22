
(function() {
    'use strict';

    angular.module('theDivisionAgent', ['ui.router', 'angular-google-gapi', 'ui.bootstrap']);

    angular.module('theDivisionAgent')
        .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
            $urlRouterProvider.otherwise('/map');
            $locationProvider.html5Mode(true).hashPrefix('*');
            $stateProvider
                .state('map', {
                    url: '/map',
                    templateUrl: '/assets/js/components/map/map.html',
                    controller: 'MapController',
                    controllerAs: 'vm'
                })
                .state('home', {
                    url: '/home',
                    templateUrl: '/assets/js/components/home/home.html'
                });
        });


    angular.module('theDivisionAgent')
        .run(['$rootScope', '$state', '$stateParams', 'GoogleURLShortener',
            function ($rootScope, $state, $stateParams, GoogleURLShortener) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;

                GoogleURLShortener.init('AIzaSyDdlHtYINPk3rVMKAlrQHj_IFgKdQcvU-M');
                // GoogleURLShortener.shorten("http://www.thedivisionagent.com/map").then(function(shortUrl){
                //     console.log("shortUrl", shortUrl);
                // });
            }
        ]);

}());
