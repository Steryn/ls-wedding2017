/// <reference path="lib/seco-assets.js" />
(function() {
    'use strict';

    angular
        .module('app')
        .controller('RaffleController2', RaffleController2);

    /** @ngInject */
    function RaffleController2($scope, dataService, $location) {
        //如果用户未填写表单，则跳转回首页
        if (!sc.userRef) {
            $location.path('/');
            return;
        }

        var lotteryBtn = $('.playbtn');
        $scope.area = sc.area;

        //抽奖结果对象
        $scope.loot = {};

        //点击按钮执行
        var click = false;

        //定义ga检测变量
        var currentArea = getQueryString('a');
        var params = currentArea + '_' + 'try'; //.split(',');
        var params2 = currentArea + '_' + 'share'; //.split(',');
        $('.raffle2 .state').click(function() {
            ga('send', 'event', params2, '2017corolla');
        })

        //开始抽奖
        $scope.getLoot = function() {
            // $('.no-after').addClass('done');
            if (click) { return; } else {
                click = true;

                //点击执行ga检测
                ga('send', 'event', params, '2017corolla');

                //获取中奖结果
                dataService.loot($scope.record, function(award) {
                    $scope.loot.resolved = true;
                    $scope.loot.item = award;
                    $scope.loot.code = award ? award.code : 'NONE';
                    $scope.loot.index = getLootIndexFromCode($scope.loot.code);
                    $scope.$apply();
                    roll($scope.loot.index);
                });
            }
        }

        function getLootIndexFromCode(code) {
            //奖品编号和轮盘位置对照表
            var map
            if (sc.area == 'xunzhan') {
                map = {
                    'A1-1': [1],
                    'A1-2': [1],
                    'A2-1': [5],
                    'A2-2': [5],
                    'A3': [3, 7],
                    'NONE': [2, 4, 6, 8]
                };
            } else if (sc.area == 'club') {
                map = {
                    'A1-1': [1, 3],
                    'A1-2': [5, 7],
                    'NONE': [2, 4, 6, 8]
                };
            }
            return _.sample(map[code]);
        }

        function roll(index) {
            rotate(index * 45);

            function rotate(r) {
                TweenMax.to(lotteryBtn, 5, {
                    rotation: r + 360 * 5,
                    onComplete: cb
                });
            };

            function cb() {
                //抽奖动画结束回调函数
                setTimeout(function() {
                    $scope.$apply(function() {
                        $scope.showResult = true;
                        //console.log('抽奖完成')
                    });
                }, 800);
                //第一次点击后回调
                //setTimeout(function() {
                //    $('.no-after').removeClass('done');
                //    click = true;
                //}, 2000);
            };
        };

        //-----------------------
        sc.img.src = 'assets/star.png';
        sc.particleTexture.setPosition(0, 2, 0);
        sc.part.startAngle2 = 180;
        sc.part.lifetime = 2;
        sc.part.numParticles = 10
        sc.part.alphaGraph = new pc.Curve([0, 0, 0.5, 0, 0.8, 1]);
        sc.part.velocityGraph = new pc.CurveSet([0, 1], [0, 1.2], [0, 0]);
        sc.part.velocityGraph2 = new pc.CurveSet([0, -1], [0, 0], [0, 0]);
        sc.part.emitterExtents = new pc.Vec3([0, 0, 0]);
        sc.part.scaleGraph = new pc.Curve([0, 0, 0.9, 0.2, 1, 0]);

        setTimeout(function() {
            sc.part.play();
        }, 1000);

        sc.r = 1.7; // 半径
        var x = 0; // 园的中心点 x 坐标
        var y = -0.4; // 园的中心点 y 坐标

        var num = 0; // 起始角度
        // 算出圆周上每一个 A 的 x,y 轴

        // sc.app.on('update', function() {
        //     num = num + 3;
        //     var a = Math.sin(num * Math.PI / 180) * sc.r + x;
        //     var b = Math.cos(num * Math.PI / 180) * sc.r + y;
        //     sc.particleTexture.setPosition(a, b, 0);
        // });
    }
})();