/// <reference path="lib/seco-assets.js" />
(function() {
    'use strict';

    angular
        .module('app')
        .controller('ClubController', ClubController);

    /** @ngInject */
    function ClubController($scope, pjUtils, dataService, $location, $http) {
        // pc访问图片
        if (!sc.isAndroid && !sc.isIphone){
            console.log('pc');
            $('.pc').addClass('on');
            return;
        }

        // 路径跳转逻辑控制
        var nextPath;
        if (sc.area == 'club' && $location.path() == '/club') {
            nextPath = 'raffle2';
            $('.red').show();
            $('.white').hide();
        } else { $location.path(''); }
        //console.log('', nextPath, $location.path());

        // 按钮可用状态
        sc.enablebtn = true;

        $scope.options = sc.ftmsFormOptions;

        $scope.record = {
            //score: $scope.data.score,
            device: pjUtils.getDeviceInfo(),
            comment: '我的卡罗拉...'
        };

        // //测试用代码--------
        // $scope.record = {
        //     name: '测试用户',
        //     sex: '男',
        //     tel: Math.floor(getRandomArbitrary(13000000000, 13888888888)) + '',
        //     buyCarTime: '一个月之内',
        //     haveCar: '新COROLLA卡罗拉',
        //     device: '测试设备',
        //     comment: '这个车真是很厉害，空间大不说，操控也特别棒，我开了一圈下来感觉太给力了。'
        // };
        // //测试用代码结束---- 

        // $scope.record2 = {
        //     name: '测试用户',
        // };

        // $scope.update = function(comment) {
        //     var text = $scope.myForm.comment.$viewValue;
        //     $scope.record.comment += text;
        // };

        $scope.area = sc.area;
        // 基本表单提交公用逻辑
        $scope.submit = function() {
            var result = $scope.myForm.checkForm();
            // console.log($scope.record);
            if (result) {
                alert(result);
                return;
            }
            $scope.record.time = Wilddog.ServerValue.TIMESTAMP;
            //console.log($scope.record);
            if (sc.enablebtn) {

                //点击后锁定按钮
                sc.enablebtn = false;

                // 验证俱乐部车主手机号
                checkClub($scope.record.tel).success(function(data) {
                    // console.log(data);
                    var isLab = /secoinfo.net|localhost/i.test(sc.baseUrl);
                    //需要返回码200
                    if (!isLab && data.code != '200') {
                        //弹出俱乐部注册浮层；
                        $(".club-fail").addClass("on");
                        sc.enablebtn = true;
                        return;
                    }
                    dataService.add($scope.record, function() {
                        //提交成功后按钮变为可点击
                        sc.enablebtn = true;
                        $scope.$apply(function() {
                            //console.log(nextPath)
                            $location.path(nextPath);
                        });
                        //console.log($scope.record);
                    });
                });

            };
        };

        function checkClub(mobile) {
            // sc.baseUrl = 'http://localhost:8089/Client%20Projects/Toyota.WeddingExpo2017/src/';
            // sc.baseUrl = 'http://localhost:8089/Purple/Toyota.WeddingExpo2017/src/';
            var url = sc.baseUrl + "club_api.php";
            var postData = { mobile: mobile };
            return $http.post(url, postData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        };

        // 查询中奖记录        
        $scope.submit2 = function() {
            var result = $scope.myForm1.checkForm();
            // console.log($scope.record);
            if (result) {
                alert(result);
                return;
            }
            if (sc.enablebtn) {
                // 点击后锁定按钮
                sc.enablebtn = false;
                dataService.findTel($scope.record2.tel, function(data) {
                    // 提交成功后按钮变为可点击
                    sc.enablebtn = true;
                    var code = _.map(data, 'awardCode')[0];
                    if (code) {
                        $scope.$apply(function() {
                            // $scope.showResult = true;
                            $(".club-modal").addClass("on");
                            $scope.code = code;
                        });
                        // console.log(code);
                        // 有奖券
                        return;
                    }
                    // 无奖券
                    else {
                        alert("很抱歉，暂时没有查询到您的奖券信息或您获得的是实物奖品");
                    }
                });
            }
        };


        // ----------------------------------
        sc.particleTexture.setPosition(0, 2.7, 0);
        sc.part.numParticles = 20;
        sc.part.rate = 0.2;
        sc.part.rate2 = 0.3;
        sc.part.velocityGraph = new pc.CurveSet([0, 0.8], [0, 0.5], [0, 0]);
        sc.part.velocityGraph2 = new pc.CurveSet([0, 0], [0, 0.5], [0, 0]);
        sc.part.emitterExtents = new pc.Vec3([3, 2.5, 3]);
        sc.part.scaleGraph = new pc.Curve([0, 0, 0.5, 0.15, 1, 0]);
        //sc.part.scaleGraph2 = new pc.Curve([0, 0, 0.5, 0.2, 1, 0]);

        setTimeout(function() {
            sc.part.play();
        }, 1000);

    };
})();