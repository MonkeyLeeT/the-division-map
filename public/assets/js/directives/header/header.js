(function() {
    'use strict';

    angular.module('theDivisionAgent')
        .directive('header', header);

    function header(){
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/assets/js/directives/header/header.html'
        };
    }
}());
