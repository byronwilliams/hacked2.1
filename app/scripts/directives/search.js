angular.module('bathHackApp').directive("search", [function($http, $interval, $timeout) {
        return {
            restrict: 'E',
            templateUrl: 'views/search.html',
            controller: 'SearchCtrl',
            scope: {
                expenses: "=expenses",
            },
        };
    }]);
