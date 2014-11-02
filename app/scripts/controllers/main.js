'use strict';
//var plotly = require(['plotly'])



/**
 * @ngdoc function
 * @name bathHackApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bathHackApp
 */
angular.module('bathHackApp').controller('MainCtrl', ['$scope', "$routeParams",
    "$location", "expenseService",  "$filter",
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

        $scope.compareDates = function(a,b) {
          if (a.Year + a.Month < b.Year + b.Month)
             return -1;
          if (a.Year + a.Month > b.Year + b.Month)
            return 1;
          return 0;
        }

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

                var reducedAmounts = {};
                var amounts = $scope.expenses.filter(function(expense){
                    return expense['Year'] && expense['Month'] && expense['Year'].length > 2

                }).sort($scope.compareDates);

                amounts.map(function (expense) {
                    var key = expense['Year'] + expense['Month'] + 1;
                    if (reducedAmounts[key]) {
                        reducedAmounts[key].amount += expense['Amount']
                    } else {
                        reducedAmounts[key] = {
                            'amount': expense['Amount'],
                            'year': expense['Year'],
                            'month': expense['Month']
                        }
                    }
                });

                var superReducedAmounts = Object.keys(reducedAmounts).map(function(key) {
                    var item = reducedAmounts[key];
                    return [Date.UTC(item['year'], item['month'], 1), item['amount']]
                });
                $scope.chartConfig.series = [{
                    data: superReducedAmounts
                }]
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
            $location.path('companies/' + supplier);
        }

        $scope.companies = [];
        expenseService.getCompaniesList().success(function(data) {
            $scope.companies = data.sort();
        })


        $scope.chartConfig = {
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Spend'
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            },
            title: {
                text: 'Date'
            }
        },
        yAxis: {
            title: {
                text: 'Spend'
            },
            min: 0
        },
        tooltip: {
            pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
        },


        series: [{
            name: 'Winter 2007-2008',
            // Define the data points. All series have a dummy year
            // of 1970/71 in order to be compared on the same x axis. Note
            // that in JavaScript, months start at 0 for January, 1 for February etc.
            data: []
        }]
        
        }

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
