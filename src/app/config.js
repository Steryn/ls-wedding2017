/// <reference path="lib/seco-helper.js" />
var sc = sc || {};
sc.isAndroid = /android/i.test(navigator.userAgent);
sc.isIphone = /iPhone/i.test(navigator.userAgent);
sc.getWxUser = false;
sc.wxUser = {};

(function() {
    sc.utmSource = getQueryString('utm_source');
    var currentArea = getQueryString('a');
    if (currentArea == '1' /* 巡展 */ ) {
        sc.area = 'xunzhan';
    } else if (currentArea == '2' /* 婚博会 */ ) {
        sc.area = 'hunbohui';
    } else if (currentArea == '3' /* 俱乐部 */ ) {
        sc.area = 'club';
    }
})();

//based url detection
sc.baseUrl = (window.location.href.match(/^http[^#?]+\//i) || [])[0] || '';

(function() {
    'use strict';

    angular
        .module('app', [
            'ngRoute',
            'ngAnimate',
            'hmTouchEvents',
            'wilddog'
        ])
        .config(config)
        .controller('RootContorller', RootContorller)
        .controller('PageController', PageController)

    //模块初始化代码
    .run(['$location', '$rootScope', '$anchorScroll', '$http', function($location, $rootScope, $anchorScroll, $http) {
        $rootScope.$on('$routeChangeSuccess', function(event, newUrl, oldUrl) {
            // 获取屏幕高度，并将其设置为body元素最小高度，防止安卓下表单输入时的上弹
            if (sc.isAndroid) {
                var minHeight = $(document).height();
                $("body").css("min-height", minHeight);
            }
            //禁止微信内向下拉动
            document.querySelector('body').addEventListener('touchmove', function(e) {
                e.preventDefault();
            })

            //切换页面后移除分享浮层
            $('.share').removeClass('on');

            //当前路径
            $rootScope.curPath = sc.area ? sc.area : '' + $location.path();
            // console.log($location.path().replace('/', ''));
            var curPath = $location.path().replace('/', '');
            //如果整合了GA检测，则推送pageview事件
            if (window.ga) {
                if (curPath != 'xunzhan' && curPath != 'hunbohui' && curPath != 'club' && curPath != 'info') {
                    return;
                }
                ga('send', 'pageview', curPath);
            }

            if (sc.isAndroid || sc.isIphone) {
                sc.part.stop();
            }

            //跳转子锚点
            setTimeout(function() {
                if ($location.hash()) {
                    $anchorScroll();
                }
            }, 300);

            sc.goSecEnable = true;

            //和autoscroll配合使用
            $rootScope.scrollTop = function() {
                return !$location.hash();
            };

        });

        $rootScope.$on("$locationChangeSuccess", function(event, cur, prev) {

        });

        $rootScope.$on("$viewContentLoaded", function(event) {});
    }]);

    /** @ngInject */
    function RootContorller($scope, $location, wxGetConfig, wxConfig) {
        if (sc.isAndroid || sc.isIphone) {
            init3D();
        }
        if (sc.isAndroid) {
            $('html').addClass('android');
        };

        //微信分享自定义配置start->
        var scwx = {};
        scwx.baseUrl = sc.baseUrl;
        console.log(sc.baseUrl);
        scwx.wxshare = {
            ftitle: 'SMILE! COROLLA 丨全新卡罗拉，驱动每个幸福的微笑，让幸福盛放',
            ttitle: 'SMILE! COROLLA 丨全新卡罗拉，驱动每个幸福的微笑，让幸福盛放',
            fdesc: 'SMILE! COROLLA',
            imgUrl: sc.baseUrl + 'assets/share.jpg',
            link: sc.baseUrl + '#/info',
            tsuccess: function() {
                // alert('已分享');
            },
            success: function() {
                // alert('已分享');
            }
        };
        wxGetConfig.main(scwx.baseUrl).then(function() {
            wxConfig.main(scwx.wxshare);
        });
        // <-end

    };

    function config($routeProvider) {
        if (sc.getWxUser) {
            var wxCode = (window.location.href.match(/code=[a-z0-9]+(&|$)/i) || [])[0] || '';

            if (!wxCode) {
                //window.location.href = sc.baseUrl + 'wxcode.php?appid=' + APPID + '&baseUrl=' + encodeURIComponent(sc.baseUrl);
                window.location.href = sc.baseUrl + 'wxcode.php';
                return;
            } else {
                //alert(window.location.href);
                //window.location.href = sc.baseUrl + 'wxuser.php?' + wxCode;
                $.post(sc.baseUrl + 'wxuser.php?' + wxCode, function(data) {
                    sc.wxUser = data;
                    //alert(sc.wxUser.headimgurl);
                    if (!sc.wxUser.headimgurl) {
                        window.location.href = sc.baseUrl + 'wxcode.php';
                    }
                });
            }
        }

        // route configuration
        $routeProvider
            .when('/', {
                templateUrl: 'app/home.html',
                controller: 'HomeController'
            })
            .when('/club', {
                templateUrl: 'app/club.html',
                controller: 'ClubController'
            })
            .when('/xunzhan', {
                templateUrl: 'app/xunzhan.html',
                controller: 'XunzhanController'
            })
            .when('/hunbohui', {
                templateUrl: 'app/hunbohui.html',
                controller: 'HunbohuiController'
            })
            .when('/:a', {
                templateUrl: function($routeParams) {
                    return 'app/' + $routeParams.a + '.html';
                },
                controller: 'PageController'
            })
            .otherwise('/');
    }

    function PageController() {}
})();