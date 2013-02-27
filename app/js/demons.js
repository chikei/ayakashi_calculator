'use strict';

angular.module('ayakashi.demons', [], function($provide){
   $provide.factory('demons', ['$http', '$rootScope', function(http, root){
       var promise = http.get('ayakashi.json').success(function(data){
           var m = {};
           var i;
           for(i = 0; i < data.length; ++i){
               data[i]['attackEff'] = data[i].attack / data[i].spirit;
               data[i]['defenseEff'] = data[i].defense / data[i].spirit;
               m[data[i].id] = data[i];
           }
           root.demons = m;
       });
       return { async: promise };
   }]);
});