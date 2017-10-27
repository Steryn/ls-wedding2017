/// <reference path="lib/seco-assets.js" />
(function() {
    'use strict';

    angular
        .module('app')
        .controller('RaffleController', RaffleController);

    /** @ngInject */
    function RaffleController($scope, dataService, $location) {
        //如果用户未填写表单，则跳转回首页
        if (!sc.userRef) {
            $location.path('/');
            return;
        }

        //按钮ga检测
        $('.raffle .state').click(function() {
            ga('send', 'event', '2_share', '2017corolla');
        })

        //抽奖结果对象
        $scope.loot = {};

        ////////////
        var lottery = {
            index: 0, //当前转动到哪个位置，起点位置
            count: 0, //总共有多少个位置
            timer: 0, //setTimeout的ID，用clearTimeout清除
            speed: 20, //初始转动速度
            times: 0, //转动次数
            cycle: 40, //转动基本次数：至少需要转动多少次再进入抽奖环节
            prize: -1, //中奖位置

            //初始化加载函数
            init: function(target, targetClass) {
                if (target.length > 0) {
                    this.units = target;
                    this.count = target.length;
                    this.addClass = targetClass;
                    target.eq(this.index).addClass(this.addClass);
                };
            },

            roll: function() {
                var index = this.index;
                var count = this.count;
                var units = this.units;
                units.eq(index).removeClass(this.addClass);
                index += 1;
                if (index > count - 1) {
                    index = 0;
                };
                units.eq(index).addClass(this.addClass);
                this.index = index;
                return false;
            },
            stop: function(index) {
                this.prize = index;
                return false;
            }
        };
        //测试
        // console.log(this.index);
        function rolls(cb) {
            lottery.times += 1;
            lottery.roll();
            //console.log(lottery.times, lottery.cycle);
            if (lottery.times > lottery.cycle + 10 && lottery.prize == lottery.index) {
                clearTimeout(lottery.timer);
                //console.log('the end', lottery.prize);
                lottery.prize = -1;
                lottery.times = 0;
                //click = false;
                cb();
            } else {
                if (lottery.times < lottery.cycle) {
                    lottery.speed -= 10;
                } else if (lottery.times >= lottery.cycle && $scope.loot.resolved && lottery.prize < 0) {
                    //var index = Math.random() * (lottery.count) | 0;
                    lottery.prize = $scope.loot.index;
                    //console.log('SET', lottery.prize, $scope.loot);
                } else {
                    if (lottery.times > lottery.cycle + 10 && ((lottery.prize == 0 && lottery.index == 7) || lottery.prize == lottery.index + 1)) {
                        lottery.speed += 110;
                    } else {
                        lottery.speed += 20;
                    }
                }
                if (lottery.speed < 40) {
                    lottery.speed = 40;
                };
                lottery.timer = setTimeout(function() {
                    rolls(cb);
                }, lottery.speed);
            }
            return false;
        }
        //测试
        //console.log(roll);

        function getLootIndexFromCode(code) {
            //奖品编号和轮盘位置对照表
            var map = {
                'A1-1': [0],
                'A1-2': [6],
                'A2-1': [2],
                'A2-2': [8],
                'A3': [4, 10],
                'NONE': [1, 3, 5, 7, 9, 11]
            };
            return _.sample(map[code]);
        }

        //点击按钮执行
        var click = false;
        lottery.init($('.raffle-inner div'), 'on');

        //开始抽奖
        $scope.getLoot = function() {
            $('.raffle-btn').addClass('on');
            //+++++TS
            //console.log("getloot-fun");
            if (click) { return; }
            // else if ($scope.data.user.guess <= 0) {
            //     alert('抽奖次数已用完');
            //     return;
            // }
            else {
                //$scope.data.user.guess--;
                click = true;

                //获取中奖结果
                dataService.loot($scope.record, function(award) {
                    //console.log(award);
                    $scope.loot.resolved = true;
                    $scope.loot.item = award;
                    $scope.loot.code = award ? award.code : 'NONE';
                    $scope.loot.index = getLootIndexFromCode($scope.loot.code);
                    $scope.$apply();
                });

                lottery.speed = 100;

                rolls(function() {
                    //抽奖动画结束回调函数
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $scope.showResult = true;
                            //console.log('抽奖完成')
                        });
                    }, 800);
                    //第一次点击后回调
                    //setTimeout(function() {
                    //    $('.raffle-btn').removeClass('on');
                    //    click = true;
                    //}, 2000);
                });

            }
        }

        // if ($location.path() == '/raffle') {
        //     $('.red').hide();
        //     $('.white').show();
        // }

        //-----------------------
        sc.particleTexture.setPosition(0, 3, 0);
        sc.part.emitterExtents = new pc.Vec3([3, 3, 3]);
        sc.part.scaleGraph = new pc.Curve([0, 0, 0.5, 0.1, 1, 0]);
        sc.part.velocityGraph = new pc.CurveSet([0, 0], [0, 0.2], [0, 0]);
        setTimeout(function() {
            sc.part.play();
        }, 1000);
    }
})();