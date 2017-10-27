(function() {
    'use strict';

    var app = angular.module('app')
        // 微信分享认证
        .factory('wxGetConfig', ['$location', '$rootScope', '$http', function($location, $rootScope, $http) {
            return {
                main: function(baseUrl) {
                    return new Promise(function(resolve) {
                        //微信初始化及自定义分享函数->
                        if (window.wx) {
                            $http.post(baseUrl + 'jssdk.php').success(function(data) {
                                wx.config({
                                    // debug: true,
                                    appId: data.appId,
                                    timestamp: data.timestamp,
                                    nonceStr: data.nonceStr,
                                    signature: data.signature,
                                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
                                });
                                resolve();
                            }).error(function() {
                                console.warn('微信自定义分享初始化出错，调用wx.php失败！');
                            });
                        }
                    })
                }
            }
        }])
        // 微信分享接口配置
        .factory('wxConfig', ['$location', '$http', function($location, $http) {
            return {
                main: function(wxshare) {
                    //微信分享接口->
                    if (window.wx) {
                        wx.ready(function() {
                            // alert('yes');
                            wx.onMenuShareTimeline({
                                title: wxshare.ttitle,
                                link: wxshare.link,
                                imgUrl: wxshare.imgUrl,
                                success: wxshare.tsuccess
                            });
                            wx.onMenuShareAppMessage({
                                title: wxshare.ftitle,
                                desc: wxshare.fdesc,
                                link: wxshare.link,
                                imgUrl: wxshare.imgUrl,
                                success: wxshare.success
                            });
                        });
                    }
                    // <-end
                }
            }

        }])
        .directive('renderer', function() {
            return {
                link: function(scope, element, attrs) {
                    element[0].appendChild(sc.renderer.view);
                }
            };
        })

    .directive('dotSwitch', function() {
        return {
            link: function(scope, element, attrs) {
                element.click(function() {
                    var checked = $(element[0]).is(':checked');
                    if (checked) {
                        $(attrs.dotSwitch).addClass('on');
                    } else {
                        $(attrs.dotSwitch).removeClass('on');
                    }
                });
            }
        };
    })

    .directive('playVideo', function() {
        return {
            link: function(scope, element, attrs) {
                var video = attrs.playVideo;
                element.click(function() {
                    $(video).fadeIn();
                    $(video).find('video')[0].play();
                });
                $(video).find('.bg').click(function() {
                    $(video).fadeOut();
                    $(video).find('video')[0].pause();
                })
            }
        };
    })

    .directive('carousel', function() {
        return {
            link: function(scope, element, attrs) {
                var el = attrs.carousel;
                element.click(function() {
                    setTimeout(function() {
                        $(el).owlCarousel({
                            loop: true,
                            responsive: {
                                0: {
                                    items: 1
                                }
                            },
                            click: true,
                        });
                        sc.owl = element;
                    }, 500);
                });
            }
        };
    })

    .directive('toCarousel', function() {
        return {
            link: function(scope, element, attrs) {
                var carousel = $('.gallery');
                if (attrs.toCarousel) {
                    var num = attrs.toCarousel[0];
                    element.click(function() {
                        carousel.addClass('on');
                        sc.owl.trigger('to.owl.carousel', [num]);
                    });
                }
            }
        };
    })

    .directive('scOnSwitch', function() {
        return {
            link: function(scope, element, attrs) {
                element.children().click(function() {
                    if (attrs.scOnSwitch) {
                        var index = $(this).index();
                        $(attrs.scOnSwitch).each(function() {
                            $(this).children().eq(index).addClass('on').siblings().removeClass('on');
                        });
                    } else {
                        $(this).addClass('on').siblings().removeClass('on');
                    }
                });
            }
        }
    })

    .directive('scOnAdd', ['$animate', function() {
        return {
            link: function(scope, element, attrs) {
                element.click(function() {
                    if (attrs.scOnAdd) {
                        $(attrs.scOnAdd).each(function() {
                            var self = this;
                            scope.$apply(function() {
                                $(self).addClass('on');
                            });
                        });
                    } else {
                        scope.$apply(function() {
                            element.addClass('on');
                        });
                    }
                });
            }
        }
    }])

    .directive('scOnRemove', ['$animate', function() {
        return {
            link: function(scope, element, attrs) {
                element.click(function() {
                    if (attrs.scOnRemove) {
                        $(attrs.scOnRemove).each(function() {
                            var self = this;
                            scope.$apply(function() {
                                $(self).removeClass('on');
                            });
                        });
                    } else {
                        scope.$apply(function() {
                            element.removeClass('on');
                        });
                    }
                });
            }
        }
    }])

    .directive('scOnToggle', function() {
        return {
            link: function(scope, element, attrs) {
                element.click(function() {
                    if (attrs.scOnToggle) {
                        if ($(attrs.scOnToggle).hasClass('on')) {
                            $(attrs.scOnToggle).each(function() {
                                $(this).removeClass('on');
                            });
                        } else {
                            $(attrs.scOnToggle).each(function() {
                                $(this).addClass('on');
                            });
                        }
                    } else {
                        if (element.hasClass('on')) {
                            element.removeClass('on');
                        } else {
                            element.addClass('on');
                        }
                    }
                });
            }
        }
    })

    .directive('scOnDelay', ['$timeout', function($timeout) {
        return {
            link: function(scope, element, attrs) {
                $timeout(function() {
                    scope.$apply(function() {
                        element.addClass('on');
                    });
                }, attrs.scOnDelay);
            }
        };
    }])

    .directive('scMusic', function() {
        return {
            link: function(scope, element, attrs) {
                var player = $('<audio></audio>').appendTo(element)[0];

                player.onplay = function() {
                    scope.$apply(function() {
                        element.addClass('on');
                    });
                };

                player.onpause = function() {
                    scope.$apply(function() {
                        element.removeClass('on');
                    });
                };

                player.src = attrs.scMusic;
                player.autoplay = true;
                player.loop = true;

                element.click(function() {
                    if (player.paused) {
                        player.play();
                    } else {
                        player.pause();
                    }
                });
            }
        };
    })

    .directive('scOnPath', ['$location', function($location) {
        return {
            link: function(scope, element, attrs) {
                scope.$on('$routeChangeSuccess', function(event, newUrl, oldUrl) {
                    var path = $location.path();
                    if (!path || !attrs.scOnPath) {
                        return;
                    }
                    if (attrs.exact && attrs.scOnPath === path) {
                        element.addClass('on');
                    } else if (!attrs.exact && path.indexOf(attrs.scOnPath) > -1) {
                        element.addClass('on');
                    } else {
                        element.removeClass('on');
                    }
                });
            }
        };
    }])

    .directive('scMusicOff', function() {
        return {
            link: function(scope, element, attrs) {
                element.click(function() {
                    if ($('[sc-music]').find('audio').length === 0) {
                        return;
                    }

                    var player = $('[sc-music]').find('audio')[0];
                    player.pause();
                });
            }
        };
    })

    .directive('scMusicOn', function() {
        return {
            link: function(scope, element, attrs) {
                element.click(function() {
                    if ($('[sc-music]').find('audio').length === 0) {
                        return;
                    }

                    var player = $('[sc-music]').find('audio')[0];
                    player.play();
                });
            }
        };
    })

    .directive('hideAt', ['$location', function($location) {
        return {
            link: function(scope, element, attrs) {
                var paths = attrs.hideAt.split(',');
                scope.$on('$routeChangeSuccess', function(event, newRoute, oldRoute) {
                    var path = $location.path();
                    if (paths.indexOf(path) > -1) {
                        element.removeClass('on');
                    } else {
                        element.addClass('on');
                    }
                });
            }
        };
    }])

    .directive('showAt', ['$location', function($location) {
        return {
            link: function(scope, element, attrs) {
                var paths = attrs.showAt.split(',');
                scope.$on('$routeChangeSuccess', function(event, newRoute, oldRoute) {
                    var path = $location.path();
                    if (paths.indexOf(path) > -1) {
                        element.addClass('on');
                    } else {
                        element.removeClass('on');
                    }
                });
            }
        };
    }])

    .directive('scroll', function() {
        var settings = {
            scrollbars: 'custom',
            tap: true,
            preventDefault: false,
            // click: true,
        };

        return {
            link: function(scope, element, attrs) {
                var name = '';
                var specImg = element.find('img').eq(0);

                if (!attrs.scroll) {
                    console.log('scroll没有绑定名称！');
                    name = 'myScroll';
                } else {
                    name = attrs.scroll;
                }
                sc[name] = new IScroll(element[0], settings);

                specImg.bind('load', function() {
                    sc[name].refresh();
                });

            }
        }
    })

    .directive('scrollRefresh', function() {
        return {
            link: function(scope, element, attrs) {
                element.click(function() {
                    setTimeout(function() {
                        sc.myScroll.refresh();
                    }, 200);
                });
            }
        }
    })

    .directive('disableTouch', function() {
        return {
            link: function(scope, element, attrs) {
                element.on('touchmove', false);
            }
        }
    })

    .directive('scFormValidation', function() {
            return {
                link: function(scope, element, attrs) {
                    var defaultMessage = '表单验证未通过。';
                    if (attrs.scFormValidation) {
                        defaultMessage = attrs.scFormValidation;
                    }
                    if (attrs.name) {
                        scope[attrs.name].checkForm = function() {
                            var result = element.find(':input.ng-invalid').eq(0).data('msg');
                            //console.log(result);
                            if (!result && element.find(':input.ng-invalid').length) {
                                result = defaultMessage;
                            }
                            return result;
                        };
                    }
                }
            };
        })
        .directive('areasForm', ['$http', function($http) {
            return {
                link: function(scope, element) {
                    var provinceIndex, cityIndex;
                    //表单三级联动
                    $.each(province_arr, function(i) {
                        element.find('.province').append('<option value="' + this + '">' + this + '</option>');
                    });
                    element.find('.province').change(function() {
                        $('.dealercode').attr("disabled", true);
                        $('.dealercode')[0].options.length = 1;
                        $('.city')[0].options.length = 0;

                        provinceIndex = _.indexOf(province_arr, $('.province').val());
                        element.find('.city').html('<option value="">请选择城市</option>');
                        $.each(city_arr[provinceIndex], function(i) {
                            element.find('.city').append('<option value="' + this + '">' + this + '</option>');
                        });
                    });
                    element.find('.city').change(function() {
                        $('.dealercode').attr("disabled", true);
                        $('.dealercode')[0].options.length = 1;

                        cityIndex = _.indexOf(city_arr[provinceIndex], $('.city').val());
                        var p = province_arr[provinceIndex];
                        var c = city_arr[provinceIndex][cityIndex];

                        var url = sc.baseUrl + 'dealer.php';
                        if (/localhost|192.168|10.0/i.test(sc.baseUrl)) {
                            url = 'http://10.0.0.24:8089/Client%20Projects/Toyota.WeddingExpo2017/src/dealer.php';
                            url = 'http://localhost:8089/Purple/Toyota.WeddingExpo2017/src/dealer.php';
                        }

                        var data = {
                            'provinceName': p,
                            'cityName': c
                        };

                        $('.dealercode')[0].options.length = 0;
                        element.find('.dealercode').append('<option value="">查询中……</option>');
                        $http.post(url, data).success(function(x) {
                            $('.dealercode')[0].options.length = 0;
                            element.find('.dealercode').append('<option value="">请选择经销商</option>');

                            var dealers = x.data;
                            if (data.cityName == '北京') {
                                dealers = dealers.filter(function(d) {
                                    return d.id == '301';
                                });
                            }
                            scope.record.dealer = '';
                            $.each(dealers, function(i) {
                                element.find('.dealercode').append('<option value="' + dealers[i].name + '">' + dealers[i].name + '</option>');
                            });
                            $('.dealercode').attr("disabled", false);
                        });
                    });
                }
            };
        }])
        .directive('addWord', function() {
            return {
                link: function(scope, element, attrs) {
                    var e = attrs.addWord.split(',');

                    element.find('a').each(function() {
                        $(this).click(function() {
                            var currentText = scope.myForm.comment.$viewValue;
                            var text = (currentText ? currentText + '，' : '') + $(this).html();
                            add(text);
                        });
                    });

                    function add(text) {
                        //console.log(scope.master);
                        scope.$apply(function() {
                            scope[e[0]][e[1]] = text;
                        });
                    }
                }
            }
        })

    .factory('pjUtils', function() {
        return {
            getDeviceInfo: function() {
                var deviceInfoArr = [];
                var ua = navigator.userAgent;
                if (/iPhone|iPad/i.test(ua))
                    deviceInfoArr.push('苹果');
                if (/Android/i.test(ua))
                    deviceInfoArr.push('安卓');
                if (/MicroMessenger/i.test(ua))
                    deviceInfoArr.push('微信');

                return deviceInfoArr.join('-');
            }
        };
    })

    .factory('dataService', ['$q', '$wilddogArray', function($q, $wilddogArray) {
        var ref = new Wilddog("https://seco.wilddogio.com/corollaWE2017"),
            awards = [],
            userComments,
            refArea;
        //sc.ref = ref;

        ref.authWithPassword({
            email: 'info@secoinfo.net',
            password: '123'
        }, function(error, data) {
            //console.log('auth result:', error, data);
        });

        if (sc.area) {
            refArea = ref.child(sc.area);
            if (sc.utmSource) {
                refArea = refArea.child('area/' + sc.utmSource);
            }
            awards = $wilddogArray(refArea.child('awards').orderByChild('odds'));

            awards.$loaded().then(function() {
                // console.log(awards);
                if (awards.length == 0) {
                    awards = $wilddogArray(ref.child(sc.area + '/awards').orderByChild('odds'));
                    awards.$loaded().then(function() {
                        // console.log(awards);
                    });
                }
            });
        }

        function lottery(rnd, time) {
            //console.log(rnd);

            //console.log('loot', rnd);
            for (var i = 0; i < awards.length; i++) {
                var aw = awards[i],
                    wonCount = refArea.child('awards/' + aw.$id + '/wonCount'),
                    quantity = refArea.child('awards/' + aw.$id + '/quantity'),
                    awtime = refArea.child('awards/' + aw.$id + '/time'),

                    chance = aw.odds * 10000,
                    cooldown = time / 1000 - aw.time / 1000;

                if (cooldown < aw.threshold || aw.quantity <= 0) {
                    //console.log('奖品冷却器未过或奖品数量为0', aw.name, cooldown);
                    continue;
                }

                if (rnd < chance) {
                    quantity.transaction(function(x) { return x - 1; });
                    wonCount.transaction(function(x) { return x + 1; });
                    awtime.set(Wilddog.ServerValue.TIMESTAMP);

                    return aw;
                }
            }
        }

        userComments = $wilddogArray(ref.child('club').child('records').orderByChild('commentShow').limitToLast(100));

        return {
            add: function(record, callback) {
                if (!refArea) {
                    alert('请扫描活动二维码参与本次活动。');
                    sc.enablebtn = true;
                    return;
                }
                refArea.child('records').orderByChild('tel').equalTo(record.tel + '').limitToFirst(1).once('value', function(ss) {
                    if (ss.val()) {
                        alert('此手机号码已提交过');

                        //提交失败后按钮变为可点击
                        sc.enablebtn = true;
                        return;
                    }

                    //save record
                    sc.userRef = refArea.child('records').push(record, function() {
                        refArea.child('info/recordCount').transaction(function(current_value) {
                            return (current_value || 0) + 1;
                        });
                        callback();
                    });

                });
            },
            loot: function(record, callback) {
                refArea.child('info').update({ time: Wilddog.ServerValue.TIMESTAMP }, function(err) {
                    refArea.child('info').once('value', function(infoss) {
                        //get current server time
                        var time = infoss.val().time;

                        // //抽奖次数消费1次
                        // refArea.child('users/' + record.mobile + '/guess').transaction(function (current_value) {
                        //     return (current_value || 0) - 1;
                        // });

                        //get the lottery!
                        var item = lottery(_.random(0, 10000), time);


                        if (item) {
                            //save record
                            sc.userRef.update({ 'award': item.name, 'awardCode': item.code, 'awardTime': time }, function() {
                                refArea.child('info/awardCount').transaction(function(current_value) {
                                    return (current_value || 0) + 1;
                                });
                                callback(item);
                            });
                        } else {
                            //delete record.award;
                            callback();
                        }
                    });
                });
            },
            loadUserData: function(cb) {
                userComments.$loaded(function(data) {
                    cb(data);
                });
            },
            findTel: function(tel, cb) {
                var query = refArea.child('records').orderByChild('tel').equalTo(tel + '').limitToFirst(1);
                query.once('value', function(data) {
                    cb(data.val());
                });
            }
        };
    }])

    .filter('mobileMask', function() {
        return function(input) {
            input = input + '';
            return input ? input.substr(0, 3) + '****' + input.substr(7) : '';
        };
    })

    //GA监测代码
    .directive('gaEvent', function() {
        return {
            link: function(scope, element, attrs) {
                if (!window.ga) {
                    return;
                }
                var currentArea = sc.area;
                element.click(function() {
                    var getQS = getQueryString('a') ? getQueryString('a') : '4';
                    var params = getQS + '_' + attrs.gaEvent; //.split(',');
                    //console.log(params);
                    ga('send', 'event', params, '2017corolla');
                });
            }
        };
    })

    .directive('repeatFinish', function() {
        return {
            link: function(scope, element, attr) {
                //console.log(scope.$index);
                if (scope.$last == true) {
                    // console.log('ng-repeat执行完毕');
                    scope.$eval(attr.repeatFinish);
                }
            }
        }
    })

})();