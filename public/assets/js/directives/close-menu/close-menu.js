(function() {
    angular
        .module('theDivisionAgent')
        .directive('tdaCloseMenu', tdaCloseMenu);

    function tdaCloseMenu() {
        return {
            restrict: 'A',
            link: function(scope, elem, attr) {
                $(elem).on('click', function(){
                    if( scope.windowInnerWidth < 768 ) {
                        $(elem).closest('nav').find('button.navbar-toggle').click();
                    }
                });
            }
        };
    }
})();
