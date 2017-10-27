var sc = sc || {};
sc.isAndroid = /android/i.test(navigator.userAgent);
sc.imageUrl = 'assets/images/';

/*
 * Array extention method for element removing.
 */
Array.prototype.remove = function () {
    var what, a = arguments,
        L = a.length,
        ax;
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
    Array.prototype.indexOf = function (elt /*, from*/ ) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0) ?
            Math.ceil(from) :
            Math.floor(from);
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

//序列文件补位
function frameName00(i) {
    if (i < 10) {
        i = '00' + i;
    } else if (i < 100) {
        i = '0' + i
    } else {
        i = i.toString();
    }
    return i;
};

//通过url创建一组图片序列
/**
 * 
 * @param {type} name 素材名
 * @param {type} imageUrl 图片地址
 * @param {type} imageType 图片格式
 * @param {type} imageQuantity 数量 
 * @param {type} frameExtraction 跳帧
 * @returns {type} 
 */
function createImagesArray(name, imageUrl, imageType, imageQuantity, frameExtraction, star) {
    var imagesArray = [],
        x = star || 1;
    imagesArray.load = false;
    for (var i = x; i < imageQuantity + 1; i++) {
        if (frameExtraction) {
            i += frameExtraction;
            if (i > imageQuantity) {
                i = imageQuantity;
            }
        }
        var num = frameName00(i);
        var assets = {
            name: name + [i],
            url: imageUrl + num + '.' + imageType
        };
        imagesArray.push(assets);
    }
    return imagesArray;
};

//通过图片序列创建MovieClip序列帧
function createMovieClip(imagesUrl) {
    var images = [];
    var mc;
    for (var i = 0; i < imagesUrl.length; i++) {
        var texture = PIXI.Texture.fromImage(imagesUrl[i].url);
        images.push(texture);
        mc = new PIXI.extras.MovieClip(images);
    }
    return mc;
};

/**
 * 加载序列帧图片素材
 * @param {type} target pixi的Loader对象
 * @param {Array} imagesArray 需要加载的图片数组
 * @param {function} endFunc 加载完成后执行函数
 */
function frameLoad(target, imagesArray, endFunc) {
    if (!target.loaded) {
        target.add(imagesArray).load(endFunc);
        target.loaded = true;
    } else {
        endFunc();
    }
};


/**
 * 播放序列帧图片
 * @param {object} mc
 * @param {number} speed 默认值为1
 * @param {boolean} loop
 */
function playCanvas(mc, speed, loop, func) {
    mc.animationSpeed = speed || 1;
    mc.play();

    if (!loop) {
        mc.loop = false;
        mc.play();

        var interval = setInterval(function () {
            if (!mc.playing) {
                if (func) {
                    func();
                }
                clearInterval(interval);
            }
        }, 20);
    } else {
        if (func) {
            func();
        }
    }
};

/**
 * 视频播放定时事件，依赖jquery
 * @param {String} target	jq对象
 * @param {Number} time	    触发时间
 * @param {Function} func	触发事件
 * 
 * 
 */
function playVideoTimeEvent(target, time, func) {
    var video = $(target)[0];
    if (time == 0) {
        $(target).on('ended', function () {
            func();
        });
    } else {
        $(target).on('timeupdate', function () {
            if (video.currentTime > time) {
                func();
            }
        });
    }
};

function androidMusicPlay() {
    if (sc.isAndroid) {
        sc.audioBtn.find('audio')[0].play();
    }
};


/**
 * 声音
 * @param {String} url	链接
 * @param {Boolean} autoPlay	自动播放
 * @param {Boolean} loop	循环
 * @param {Function} onPlay	当播放时
 * @param {Function} onPause	当暂停时
 * @param {Function} onEnded	当结束时
 * 
 * 
 */
function lAudio(url, autoPlay, loop, onPlay, onPause, onEnded) {
    var audio = document.createElement("audio")
    audio.src = url;
    audio.loop = false;

    audio.autoplay = autoPlay
    if (onPlay != undefined) audio.addEventListener("play", onPlay)
    if (onPause != undefined) audio.addEventListener("pause", onPause)
    audio.addEventListener("ended", function () {
        if (onEnded != undefined) onEnded()

        if (loop) {
            audio.play()
        }
    })

    audio.restart = function () {
        audio.currentTime = 0
        audio.play()
    }

    /*
	audio.originalPlay = audio.play
	
	audio.play =function  () 
	{
		$(audio).unbind("play",loadPlay)
		audio.originalPlay()
	}
	
	//调用play来实现加载
	audio.startLoad =function  () 
	{
		$(audio).bind("play",loadPlay)
		audio.originalPlay()
		
	}
	function loadPlay () 
	{
		audio.pause()
	}*/

    return audio
}

// 图片URL路径补位
function image(n) {
    return sc.imageUrl + n;
};

// 转化数字千分符
function numToMil(num) {
    return (num.toFixed(0) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}

// 获取URL参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}