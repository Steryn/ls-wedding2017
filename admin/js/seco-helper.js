/*
 * Array extention method for element removing.
 */
Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
 * If there is no indexOf func (for IE8), create it manually.
 */
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt /*, from*/) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0)
             ? Math.ceil(from)
             : Math.floor(from);
        if (from < 0)
            from += len;
        for (; from < len; from++) {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
}

/*
 * jQuery plugin for detecting position in a relative manor
 */
(function ($) {
    $.fn.offsetRelative = function (top) {
        var $this = $(this);
        var $parent = $this.offsetParent();
        var offset = $this.position();
        if (!top) return offset; // Didn't pass a 'top' element 
        else if ($parent.get(0).tagName == "BODY") return offset; // Reached top of document
        else if ($(top, $parent).length) return offset; // Parent element contains the 'top' element we want the offset to be relative to 
        else if ($parent[0] == $(top)[0]) return offset; // Reached the 'top' element we want the offset to be relative to 
        else { // Get parent's relative offset
            var parent_offset = $parent.offsetRelative(top);
            offset.top += parent_offset.top;
            offset.left += parent_offset.left;
            return offset;
        }
    };
    $.fn.positionRelative = function (top) {
        return $(this).offsetRelative(top);
    };
}(jQuery));

/*
 * 加on在一定时间后自动移除
 */
function addRemoveOn(selector, time) {
    $(selector).addClass('on');
    setTimeout(function () {
        $(selector).removeClass('on');
    }, time);
}

/*
 * 加on在一定时间后再加ac，在移除
 */
function addRemoveOnAc(selector, time) {
    $(selector).addClass('on');
    setTimeout(function () {
        $(selector).addClass('ac');
        setTimeout(function () {
            $(selector).fadeOut();
        }, 500);
    }, time);
}

// 安卓监测
sc.ua = navigator.userAgent;
console.log(sc.ua);
//alert(ua);

sc.android = /Android/i.test(sc.ua); //判断是否为安卓手机，为分享文字使用；
sc.microMessenger = /MicroMessenger/i.test(sc.ua); //判断是否为微信浏览器；

sc.disableVideo = /Android/i.test(sc.ua);
sc.enableVideo = /Android (5\.[1-9]|[6-9]\.[0-9])/i.test(sc.ua);
sc.playvideo = true;

if (sc.disableVideo) {
    $('html').addClass('android');
    sc.playvideo = false;
    //alert('disableVideo');
    if (sc.enableVideo && !sc.microMessenger) {
        $('html').removeClass('android');
        sc.playvideo = true;
        //alert('enableVideo');
    };
};


function musicOn() {
    var isMusic = window.confirm('可开启音乐，获得更佳体验');
    var player = $('.btn-music audio')[0];
    player.pause();
    if (isMusic) {
        player.play();
    };
};


// 获取URL参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}