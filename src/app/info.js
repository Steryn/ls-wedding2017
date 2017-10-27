/// <reference path="lib/seco-assets.js" />

(function() {
    'use strict';

    angular
        .module('app')
        .controller('InfoController', InfoController);

        function InfoController($scope, pjUtils, dataService, $location){
            console.log("InfoController");
        }

})();