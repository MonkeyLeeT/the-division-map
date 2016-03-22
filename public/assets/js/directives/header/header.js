(function() {
    'use strict';

    angular.module('theDivisionAgent')
        .directive('header', header);

    function header(){
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/assets/js/directives/header/header.html',
            controller: HeaderController,
            controllerAs: 'vm'
        };
    }

    HeaderController.$inject = ['$uibModal'];
    function HeaderController($uibModal){
        var vm = this;

        vm.donate = function(){
            $uibModal.open({
                animation: true,
                templateUrl: '/assets/js/components/donate/donate.html',
                controller: 'DonateController',
                controllerAs: 'vm',
                size: 'md'
            });
        };

        return vm;
    }
}());
