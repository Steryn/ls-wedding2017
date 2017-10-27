/// <reference path="lib/seco-assets.js" />

(function() {
    'use strict';

    angular
        .module('app')
        .controller('CommentController', CommentController);

    function CommentController($scope, dataService, $wilddogArray) {
        dataService.loadUserData(function(userComments) {
            // $scope.users = _.sortBy(_.union(userComments), function(e) {
            //     return !e.time;
            // });
            $scope.users = _.sortBy(userComments, function (e) {
                return !e.time;
            }).reverse();
            //console.log($scope.users);
        });
        $scope.renderFinish = function (e) {
            setTimeout(function () {
                sc[e].refresh();                
            },200);
        }
    };

})();