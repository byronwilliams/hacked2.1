angular.module('bathHackApp')
    .service('expenseService', ['$http', function ($http) {

        //var urlBase = 'http://expose.112percent.com:8080/api/companies/';
        var urlBase = '/api/companies/';

        this.dataFields = [
            'BodyName',
            'TransactionNumber',
            'AccountCodeDescription',
            'ExpensesType',
            'ServiceCode',
            'ServiceAreaCategorisation',
            'SupplierName',
            'Date',
            'Amount'
        ]

        this.getExpenseData = function(year, month, company) {
            // return expense data
            yearToUse = year || '';
            monthToUse = month || '';
            companyToUse = company || '';
            return $http.get(urlBase + '?SupplierName=' + companyToUse + '&Year=' + yearToUse + '&Month=' + monthToUse);
        };

        //?supplierName=CONSTRUCTION%20SERVICES&year=2014
        this.upVoteExpense = function(expense) {
            // update index
            return $http.post('http://expose.112percent.com:8080/api/update/',  expense);
        };

        this.getCompaniesList = function() {
            return $http.get("http://expose.112percent.com:8080/api/ltdcompanies/");
        }
}]);
