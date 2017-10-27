(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    /** @ngInject */
    function HomeController($scope, $location) {
        if (sc.area == 'hunbohui') { $location.path('hunbohui'); }
        else if (sc.area == 'xunzhan') { $location.path('xunzhan'); }
        else if (sc.area == 'club') { $location.path('club');}    
        else { alert('访问路径有误'); }
    };
})();