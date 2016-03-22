(function() {
    'use strict';

    angular.module('theDivisionAgent')
        .controller('DonateController', DonateController);

    DonateController.$inject = ['$uibModalInstance'];
    function DonateController($uibModalInstance) {
        var vm = this;

        vm.close = function () {
            $uibModalInstance.dismiss();
        };

        return vm;
    }
}());
