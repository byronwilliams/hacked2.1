'use strict';
//var plotly = require(['plotly'])



/**
 * @ngdoc function
 * @name bathHackApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bathHackApp
 */
angular.module('bathHackApp').controller('MainCtrl', ['$scope', "$routeParams", "$location", "expenseService",  "$filter",
    function ($scope, $routeParams, $location, expenseService, $filter) {

        $scope.years = ['2011', '2012', '2013', '2014'];
        $scope.months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

        $scope.fields = expenseService.dataFields
        $scope.company = $routeParams.company;
        $scope.searchText = '';
        $scope.suggestions = [];

        $scope.selectYear = function(year) {
            $scope.selectedYear = year;
            $scope.search();
        };

        $scope.selectMonth = function(month) {
            $scope.selectedMonth = month;
            $scope.search();
        };

        $scope.reset = function() {
            $scope.expenses = [];
            $scope.selectedYear = null;
            $scope.selectedMonth = null;
            $location.path('/');
            $scope.suggestions = [];
            $scope.search();
        };

        $scope.search = function() {
            // search by year and month
            expenseService.getExpenseData($scope.selectedYear, $scope.selectedMonth, $scope.company)
            .success(function(data) {
                $scope.expenses = data;

                var count = 0;
                $scope.expenses.filter(function (expense) {
                    count += expense.Amount;
                });
                $scope.expenseCount = count;


                var times = $scope.expenses.map(function (expense) {
                    return expense['Date']
                });

                var amounts = $scope.expenses.map(function (expense) {
                    return expense['Amount']
                });

                // generate graph
                var data = [{x:times, y:amounts, type: 'scatter'}];
                var layout = {fileopt : "extend", filename : "nodenodenode"};

                //graphs url
                //plotly.plot(data, layout, function (err, msg) {
                //    console.log(msg['url']);
                //});

            });
        }
        $scope.search();

        $scope.upVote = function(expense) {
            expense.Votes += 1;
            expenseService.upVoteExpense(expense);
        }

        $scope.companySearch = function() {
            if ($scope.searchText) {
                $scope.suggestions = $filter("pgFullText")($scope.companies, $scope.searchText).slice(0,10)
            } else {
                $scope.suggestions = [];
            }
        }

        $scope.selectSupplier= function(supplier) {
            $scope.company = supplier;
            $scope.suggestions = [];
            $scope.search();
        }

        $scope.companies = [];
        expenseService.getCompaniesList().success(function(data) {
            $scope.companies = data.sort();
        })


}])
.controller("CompaniesListCtrl", function($scope, expenseService) {
    $scope.companies = [];
    expenseService.getCompaniesList().success(function(data) {
        $scope.companies = data.sort();
    })
})
.filter("pgFullText", [function() {
    return function(companys, searchParam) {
        var words = searchParam.split(" ");

        var filterFn = function(company) {
            return words.reduce(function(result, word) {
                var re = new RegExp(word, "ig");
                return result && re.test(company);
            }, true);
        }

        return companys.filter(filterFn);
    };
}]);
