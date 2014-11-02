'use strict';

/**
 * @ngdoc overview
 * @name bathHackApp
 * @description
 * # bathHackApp
 *
 * Main module of the application.
 */
angular
  .module('bathHackApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/companies', {
        templateUrl: 'views/list.html',
        controller: 'CompaniesListCtrl'
      })
      .when('/companies/:company', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
