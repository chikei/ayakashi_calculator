'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['ngCookies', 'ayakashi.demons', 'ayakashi.filters']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/list', {templateUrl: 'partials/list.html', controller: AllListCtrl});
    $routeProvider.when('/owned', {templateUrl: 'partials/list.html', controller: OwnedListCtrl});
    $routeProvider.otherwise({redirectTo: '/list'});
  }]);
