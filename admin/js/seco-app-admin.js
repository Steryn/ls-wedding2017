var sc = sc || {};

moment.locale('zh-cn');
sc.area = [
    '', //预留
    'xunzhan', //巡展
    'hunbohui', //婚博会
    'club', //俱乐部
];

sc.cityData = {
    xunzhan: [
        { $id: 'tangshan' },
        { $id: 'anshan' },
        { $id: 'daqing' },
        { $id: 'qiqihaer' },
        { $id: 'chifeng' },
        { $id: 'shijiazhuang' },
        { $id: 'zibo' },
        { $id: 'rizhao' },
        { $id: 'jining' },
        { $id: 'xinxiang' },
        { $id: 'luoyang' },
        { $id: 'taiyuan' },
        { $id: 'yinchuan' },
        { $id: 'lanzhou' },
        { $id: 'xining' },
        { $id: 'jiuquan' },
        { $id: 'wulumuqi' },
        { $id: 'changji' },
        { $id: 'nantong' },
        { $id: 'changzhou' },
        { $id: 'jiaxing' },
        { $id: 'taizhou' },
        { $id: 'jinhua' },
        { $id: 'nanchang' },
        { $id: 'fuzhou' },
        { $id: 'jiujiang' },
        { $id: 'zhongshan' },
        { $id: 'haikou' },
        { $id: 'nanning' },
        { $id: 'guiyang' },
        { $id: 'nanchong' },
        { $id: 'mianyang' },
        { $id: 'nanyang' },
    ],
    hunbohui: [
        { $id: 'beijing' },
        { $id: 'hangzhou' },
        { $id: 'shanghai' },
        { $id: 'guangzhou' },
        { $id: 'wuhan' },
        { $id: 'tianjin' },
    ]
};


sc.app = angular.module('scApp', ['ngRoute', 'wilddog', 'angularUtils.directives.dirPagination'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: '_home.html',
            controller: 'HomeController'
        }).when('/:a', {
            templateUrl: function(params) {
                return '_' + params.a + '.html';
            },
            controller: 'DrouteController'
        }).otherwise({
            redirectTo: '/'
        });
    }])

.controller('RootController', ['$scope', '$rootScope', 'ref', '$wilddogArray', '$location', function($scope, $rootScope, ref, $wilddogArray, $location) {
    //sc.scope = $scope;

    $scope.$on('$routeChangeStart', function(event, next, current) {
        if (next.params && next.params.a === 'login') {
            return;
        }

        // var dataStr = localStorage['wilddog:session::seco'];
        // var data = eval('(' + dataStr + ')');
        $scope.auth = ref.getAuth();

        if (!$scope.auth) {
            event.preventDefault();
            $scope.adminPermission = NaN;
            $location.path('/login');
        }

        switch ($scope.auth.uid) {
            case 'simplelogin:1459607012058924': //info@secoinfo.net
                $scope.adminPermission = 0;
                break;
            case 'simplelogin:1459688354820393': //info@seco.cn
                $scope.adminPermission = 1;
                break;
        }
    });

    $scope.$on('$routeChangeSuccess', function(event, newUrl, oldUrl) {
        window.scrollTo(0, 0); //切换场景后滚动到顶部
        var url = window.location;
        $('ul.nav a').removeClass('active');
        var element = $('ul.nav a').filter(function() {
            return url.href.includes(this.href);
        }).addClass('active').parent().parent().addClass('in').parent();

        if (element.is('li')) {
            element.addClass('active');
        }

        sc.currentArea = $location.search().a;
        sc.childArea = $location.search().area;

        $scope.dataPath = sc.area[sc.currentArea];
        $scope.childArea = sc.childArea;
        $scope.downloadPath = $scope.dataPath;
        if (sc.childArea) {
            $scope.downloadPath = sc.area[sc.currentArea] + '/area/' + sc.childArea;
        }
        // console.log($scope.dataPath, sc.childArea);

        $scope.cityData = sc.cityData[$scope.dataPath];

    });

    $scope.$on("$locationChangeSuccess", function(event, cur, prev) {});

    $scope.$on("$viewContentLoaded", function(event) {});

    $scope.data = {};

    $scope.logout = function() {
        ref.unauth();
        delete $scope.auth;
        $location.path('/login');
    };

    // 初始化子区域数据
    // var xunzhanData = ref.child('xunzhan/area').once('value', function(data) {
    //     // console.log(data);
    // }, function(err) {
    //     console.log(err)
    // });
    // console.log(xunzhanData);

    //var hunbohuiData = $wilddogArray(ref.child('hunbohui/area'));

    $scope.xunzhanData = sc.cityData.xunzhan;
    $scope.hunbohuiData = sc.cityData.hunbohui;

    //console.log($scope.xunzhanData);
}])

.controller('DrouteController', ['$scope', function($scope) {}])
    .controller('HomeController', ['$scope', 'ref', '$wilddogArray', function($scope, ref, $wilddogArray) {
        // $scope.awards = $wilddogArray(ref.child('awards'));

        // ref.child('info/recordsCount').once('value', function (ss) {
        //     $scope.$apply(function () {
        //         $scope.recordsCount = ss.val() || 0;
        //     });
        // });

        window.location.href = '#/records?a=1';
    }])
    .controller('LoginController', ['$scope', 'ref', '$location', function($scope, ref, $location) {
        $scope.form = {};

        $scope.login = function() {
            ref.authWithPassword({
                email: $scope.form.email,
                password: $scope.form.password
            }, function(error, data) {
                //console.log('auth result:', error, data);
                if (error) {
                    alert('登录出错,请重试!');
                    return;
                }

                $scope.$apply(function() {
                    $location.path('/');
                });
            });
        };
    }])
    .controller('RecordsController', ['$scope', '$location', 'ref', '$wilddogArray', '$wilddogObject', '$http', function($scope, $location, ref, $wilddogArray, $wilddogObject, $http) {
        sc.scope = $scope;
        $scope.currentArea = sc.currentArea;

        var refArea = ref.child(sc.area[sc.currentArea]);
        var cUrl = 'https://seco.wilddogio.com/corollaWE2017/' + sc.area[sc.currentArea];
        if (sc.childArea) {
            refArea = ref.child(sc.area[sc.currentArea] + '/area/' + sc.childArea);
            cUrl = 'https://seco.wilddogio.com/corollaWE2017/' + sc.area[sc.currentArea] + '/area/' + sc.childArea;
        }
        var refa = refArea.child('records');
        $scope.records = $wilddogArray(refa.limitToLast(100));

        function recordCount() {
            var countUrl = cUrl + '/records.json?auth=' + $scope.auth.token + '&count=true';
            var countAwardUrl = cUrl + '/records.json?auth=' + $scope.auth.token + '&orderBy="awardCode"' + '&count=true';
            $http.get(countUrl).then(function(c) {
                $scope.recordCount = c.data;
            });
            $http.get(countAwardUrl).then(function(c) {
                $scope.awardCount = c.data;
            });
        };
        recordCount();
        refArea.child('/records').limitToLast(1).on('value', function() {
            recordCount();
        });

        $scope.getRecord = function(tel) {
            if (!tel) {
                alert('请输入手机号！');
                return;
            }
            var searchRecords = $wilddogArray(refa.orderByChild('tel').equalTo(tel).limitToFirst(1));
            searchRecords.$loaded().then(function(data) {
                if (!data[0]) {
                    var searchRecordsName = $wilddogArray(refa.orderByChild('name').equalTo(tel).limitToFirst(50));
                    searchRecordsName.$loaded().then(function(data) {
                        $scope.searchRecordsShow = true;
                        $scope.searchRecords = data;

                        if (!data[0]) {
                            $scope.searchRecordsShow = false;
                            return;
                        }
                    });
                }
                $scope.searchRecordsShow = true;
                $scope.searchRecords = data;
                // console.log(data);
            });
        };

        $scope.setRecord = function(record, records) {
            if (!record.awardReceive && confirm('确认该奖品已经发放')) {
                record.awardReceive = true;
            } else {
                if ($scope.adminPermission == 1) {
                    return;
                }
                record.awardReceive = false;
            }
            $scope[records].$save(record);
        };

        $scope.removeRecord = function(record) {
            //console.log($scope.records);
            if (!confirm('确认删除【' + record.name + '】吗？')) {
                if ($scope.adminPermission == 1) {
                    return;
                }
                return;
            }

            $scope.records.$remove(record).then(function() {
                recordCount();
            });
            refArea.child('info/recordCount').transaction(function(current_value) {
                return (current_value || 0) - 1;
            });

            if (record.award) {
                var aw = $wilddogArray(refArea.child('awards').orderByChild('name').equalTo(record.award).limitToFirst(1));
                aw.$loaded().then(function() {
                    // console.log(aw[0].wonCount);
                    var wonCount = refArea.child('awards/' + aw[0].$id + '/wonCount'),
                        quantity = refArea.child('awards/' + aw[0].$id + '/quantity');

                    quantity.transaction(function(x) { return x + 1; });
                    wonCount.transaction(function(x) { return x - 1; });
                });

                refArea.child('info/awardCount').transaction(function(current_value) {
                    return (current_value || 0) - 1;
                });
            }
        };

        // $scope.areaData = $wilddogArray(ref.child(sc.area[sc.currentArea] + '/area'));
        // $scope.removeChildArea = function(item) {
        //     var code = Math.floor(getRandomArbitrary(1000, 9999)) + '';
        //     var value = prompt('删除子区域' + item.$id + '的全部数据，请输入验证码：' + code, '');
        //     if (value != code) { alert('验证码错误！'); return; }
        //     $scope.areaData.$remove(item);
        //     alert('删除成功！');
        // };
    }])
    .controller('AwardsController', ['$scope', 'ref', '$wilddogArray', '$wilddogObject', '$http', function($scope, ref, $wilddogArray, $wilddogObject, $http) {
        //sc.scope = $scope;
        $scope.currentArea = sc.currentArea;

        $scope.newAward = {
            code: 0,
            quantity: 0,
            odds: 0,
            threshold: 0,
            wonCount: 0
        };

        var refArea = ref.child(sc.area[sc.currentArea]);
        var cUrl = 'https://seco.wilddogio.com/corollaWE2017/' + sc.area[sc.currentArea];
        if (sc.childArea) {
            refArea = ref.child(sc.area[sc.currentArea] + '/area/' + sc.childArea);
            cUrl = 'https://seco.wilddogio.com/corollaWE2017/' + sc.area[sc.currentArea] + '/area/' + sc.childArea;
        }

        var refa = refArea.child('awards');

        function recordCount(awardCode) {
            var countAwardUrl = cUrl + '/records.json?auth=' + $scope.auth.token + '&orderBy="awardCode"&equalTo="' + awardCode + '"&count=true';
            return $http.get(countAwardUrl);
        };

        $scope.awards = $wilddogArray(refa);
        $scope.awards.$loaded().then(function() {
            angular.forEach($scope.awards, function(val, key) {
                recordCount(val.code).then(function(c) {
                    val.newWonCount = c.data;
                })
            });
        });

        refArea.child('/records').limitToLast(1).on('value', function() {
            angular.forEach($scope.awards, function(val, key) {
                recordCount(val.code).then(function(c) {
                    val.newWonCount = c.data;
                })
            });
        });

        $scope.add = function(award) {
            console.log(award);
            refa.push(award);
        };

        $scope.update = function(award) {
            if (!confirm('确认更新【' + award.name + '】吗？')) {
                return;
            }

            refa.child(award.$id + '/wonCount').transaction(function(current_value) {
                return award.wonCount = current_value;
            }, function(error, committed, snapshot) {
                if (error) {
                    alert(error);
                } else if (committed) {
                    $scope.awards.$save(award).then(function() {
                        alert('更新【' + award.name + '】成功！');
                    });
                }
            });
        };

        $scope.remove = function(award) {
            if (!confirm('确认删除【' + award.name + '】吗？')) {
                return;
            }
            $scope.awards.$remove(award);
        };

        $scope.updateWonCount = function(award) {
            var value = prompt("请输入更新数据(数字),慎用！更新数据不会同步到全局中奖纪录统计中。", "");
            var count = Number(value);
            if (value == null) {
                return;
            } else if (value != '' && !isNaN(count)) {
                refa.child(award.$id + '/wonCount').set(count);
            } else {
                alert('请输入数字！');
            }
        };

        $scope.copyAward = function() {
            if (!confirm('确认将默认奖品数据覆盖到当前子区域【' + sc.childArea + '】吗？')) {
                return;
            }
            var defaultAwards = $wilddogArray(ref.child(sc.area[sc.currentArea] + '/awards'));
            var oldAwards = $wilddogObject(refa);
            oldAwards.$remove().then(function() {
                defaultAwards.$loaded().then(function() {
                    for (i = 0; i < defaultAwards.length; i++) {
                        defaultAwards[i].wonCount = 0;
                        $scope.awards.$add(defaultAwards[i]);
                    }
                });
            });
        };
    }])
    .factory('ref', function() {
        return new Wilddog("https://seco.wilddogio.com/corollaWE2017");
    })
    .filter('timestamp', function() {
        return function(input, format) {
            return moment(input).format(format);
        };
    })

;