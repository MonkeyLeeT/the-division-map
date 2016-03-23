(function() {
    angular
        .module('theDivisionAgent')
        .directive('tdaCloseMenu', tdaCloseMenu);

    function tdaCloseMenu() {
        return {
            restrict: 'A',
            link: function(scope, elem, attr) {
                $(elem).on('click', function(){
                    $(elem).closest('nav').find('button.navbar-toggle').click();
                });
            }
        };
    }
})();
