/// <reference path="lib/seco-assets.js" />
(function() {
    'use strict';

    angular
        .module('app')
        .controller('XunzhanController', XunzhanController);

    /** @ngInject */
    function XunzhanController($scope, pjUtils, dataService, $location, $http) {
        // 路径跳转逻辑控制
        var nextPath;
        if (sc.area == 'xunzhan' && $location.path() == '/xunzhan') {
            nextPath = 'raffle2';
            $('.red').show();
            $('.white').hide();
        } else {
            $location.path('');
        }
        //console.log('', nextPath, $location.path());

        // 按钮可用状态
        sc.enablebtn = true;

        $scope.options = sc.ftmsFormOptions;

        $scope.record = {
            //score: $scope.data.score,
            device: pjUtils.getDeviceInfo(),
            utmSource: sc.utmSource,
        };

        //测试用代码--------
        // $scope.record = {
        //     name: '测试用户',
        //     sex: '男',
        //     tel: Math.floor(getRandomArbitrary(13000000000, 13888888888)) + '',
        //     buyCarTime: '一个月之内',
        //     haveCar: '新COROLLA卡罗拉',
        //     device: '测试设备',
        //     province: '省',
        //     city: '市',
        //     dealer: '经销商',
        // };

        // $scope.record2 = {
        //     name: '测试用户',
        // };

        // //测试用代码结束---- 

        $scope.area = sc.area;
        $scope.update = function(comment) {
            var text = $scope.myForm.comment.$viewValue;
            $scope.record.comment += text;
        };

        // 基本表单提交公用逻辑
        $scope.submit = function() {

            var result = $scope.myForm.checkForm();
            // console.log($scope.record);
            if (result) {
                alert(result);
                return;
            }

            $scope.record.time = Wilddog.ServerValue.TIMESTAMP;
            //$scope.record.time = new Date().getTime();
            //console.log($scope.record);

            // console.log($scope.record.haveCar);
            var $lever;
            var $carId;
            var $name = $('.name').val();
            var $tel = $('.tel').val();
            var $province = $('.province').val();
            var $city = $('.city').val();
            var $DLRname = $('.dealercode').val();
            var $DLRcode = '';
            var $archiveId = 'COROLLA_503_SHOW';
            // console.log($DLRname);
            // 购车时间转换id
            for (var i = 0; i < sc.ftmsFormOptions.buyCarTimes.length; i++) {
                if ($scope.record.buyCarTime == sc.ftmsFormOptions.buyCarTimes[i]) {
                    $lever = i + 1;
                }
            }
            // 车型转换id
            for (var i = 0; i < sc.ftmsFormOptions.haveCars.length; i++) {
                if ($scope.record.haveCar == sc.ftmsFormOptions.haveCars[i]) {
                    $carId = sc.ftmsFormOptions.carId[i];
                }
            }
            // console.log($lever, $carId);
            var url = sc.baseUrl + 'dealer.php';
            var $arr = {
                'provinceName': $province, //$province,
                'cityName': $city //$city
            };
            $http.post(url, $arr).success(function(x) {
                //获取经销商code
                for (var i = 0; i < x.data.length; i++) {
                    if ($DLRname == x.data[i].name) {
                        $DLRcode = x.data[i].code;
                    }
                };
                // console.log($lever, $name, $tel, $DLRname, $DLRcode, $carId, $archiveId, sc.utmSource);
                $http({
                    method: 'post',
                    url: sc.baseUrl + 'recordInfo.php',
                    data: {
                        leverId: $lever, //*线索级别
                        openid: '',
                        name: $name, //*用户姓名
                        tel: $tel, //*用户电话
                        DLRname: $DLRname, //*经销商名字
                        DLRcode: $DLRcode, //*经销商code
                        carModel: $carId, //*意向车型
                        archiveId: $archiveId, //活动标识
                        fromStatus: sc.utmSource, //*地点参数
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    transformRequest: function(obj) {
                        var str = [];
                        for (var p in obj) {
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        }
                        return str.join("&");
                    }
                }).success(function(data) {
                    console.log(data);
                });
            });

            if (sc.enablebtn) {

                //点击后锁定按钮
                sc.enablebtn = false;

                dataService.add($scope.record, function() {
                    //提交成功后按钮变为可点击
                    sc.enablebtn = true;
                    $scope.$apply(function() {
                        //console.log(nextPath)
                        $location.path(nextPath);
                    });
                    //console.log($scope.record);
                });
            };
        };

        $scope.submit2 = function() {
            var result = $scope.myForm1.checkForm();
            // console.log($scope.record);
            if (result) {
                alert(result);
                return;
            }
            if (sc.enablebtn) {
                //点击后锁定按钮
                sc.enablebtn = false;
                dataService.findTel($scope.record2.tel, function(data) {
                    //提交成功后按钮变为可点击
                    sc.enablebtn = true;
                    var code = _.map(data, 'awardCode')[0];
                    if (code && code != "A3") {
                        $scope.$apply(function() {
                            // $scope.showResult = true;
                            $(".xz-modal").addClass("on");
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