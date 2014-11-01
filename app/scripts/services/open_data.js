angular.module('bathHackApp')
    .service('expenseService', ['$http', function ($http) {

        var pageSize = 10;
        var firstPage = 1;

        var urlBase = '/api/users/';

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
            return [
                {
                    'id': 1,
                    'BodyName': 'BANES',
                    'TransactionNumber': '001',
                    'AccountCodeDescription': 'SCA!',
                    'ExpensesType': 'Hotels',
                    'ServiceCode': 'BABA',
                    'ServiceAreaCategorisation': 'SCA1',
                    'SupplierName': 'UK pertole',
                    'Date': '28/10/89',
                    'Amount': 189, // pounds format
                    'Votes': 0
                },
                {
                    'id': 2,
                    'BodyName': 'BANES',
                    'TransactionNumber': '002',
                    'AccountCodeDescription': 'SCA2',
                    'ExpensesType': 'Cars',
                    'ServiceCode': 'BABA',
                    'ServiceAreaCategorisation': 'SCA1',
                    'SupplierName': 'UK pertole',
                    'Date': '31/10/89',
                    'Amount': 2700,
                    'Votes': 0
                },
            ]
            //return $http.get(urlBase + id);
        };

        this.upVoteExpense = function(index, votes) {
            // update index
            //return $http.put(urlBase + index + "/",  { 'Votes': votes += 1});

        };



}]);