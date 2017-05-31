//依赖cheerio    npm install cheerio --save--dev
var fs = require('fs');
var http = require('http');
var cheerio = require('cheerio');

fs.mkdir(__dirname + '/images/');
var Req = function Req(path, callback) {
    http.get(path, function (res) {
        var arrBuf = [];
        var bufLength = 0;
        res.on('data', function (data) {
            arrBuf.push(data);
            bufLength += data.length;
        });
        res.on('end', function () {
            callback && callback(Buffer.concat(arrBuf, bufLength));
        });
    }).on('error', function (e) {
        console.log('\u9519\u8BEF: ' + e.message);
    });
};

var ArrayDowm = function ArrayDowm(UrlArray, callback) {
    console.log('ArrayDowm', UrlArray.length);
    var arri = 0;
    var dowmimg = function dowmimg(img, back) {
        Req(img, function (data) {
            var name = img.split('/')[8];
            fs.writeFile(__dirname + '/images/' + name, data, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    back();
                }
            });
        });
    };
    var htmlreq = function htmlreq(url, back) {
        var p = url.split('.');
        var i = 2;
        var sum = 0;
        Req('http://pic.ali213.net' + url, function (data) {
            var $ = cheerio.load(data.toString());
            var href = $('.Ali_Ts1 a').attr('href');
            var title = $('.centers1 span').text();
            var ssum = title.split('/')[1];
            var sum = ssum.substr(0, ssum.length - 1) - '';
            console.log('imgarray', sum);
            dowmimg(href.split('?')[1], function () {
                var initpng = function initpng() {
                    console.log('img', i);
                    Req('http://pic.ali213.net' + p[0] + '_' + (i + '') + '.' + p[1], function (data) {
                        var $ = cheerio.load(data.toString());
                        var href = $('.Ali_Ts1 a').attr('href');
                        dowmimg(href.split('?')[1], function () {
                            i += 1;
                            if (i < sum + 1) {
                                initpng();
                            } else {
                                back();
                            }
                        });
                    });
                };
                initpng();
            });
        });
    };
    var run = function run() {
        htmlreq(UrlArray[arri], function () {
            if (arri < UrlArray.length + 1) {
                arri += 1;
                run();
            } else {
                callback();
            }
        });
    };
    run();
};

var RequrlArray = function RequrlArray(jk, callback) {
    if (jk == 1) {
        Req('http://pic.ali213.net/list/meinv/', function (data) {
            var $ = cheerio.load(data.toString());
            var iArr = $('.pic-list li');
            var q = [];
            for (var i = 1; i < iArr.length; i++) {
                var k = $(iArr[i]).find('a');
                q.push($(k).attr('href'));
                if (i == iArr.length - 1) {
                    ArrayDowm(q, function () {
                        callback();
                    });
                }
            }
        });
    } else {
        Req('http://pic.ali213.net/list/meinv/index_' + (jk + '') + '.html', function (data) {
            var res = JSON.parse(data.toString());
            var html = res.html;
            var $ = cheerio.load(html);
            var iArr = $('li a');
            var q = [];
            for (var i = 0; i < iArr.length; i++) {
                q.push($(iArr[i]).attr('href'));
                if (i == iArr.length - 1) {
                    ArrayDowm(q, function () {
                        callback();
                    });
                }
            }
        });
    }
};
var Requrl_i = 1;
var type = true;
setInterval(function () {
    if (Requrl_i < 21) {
        if (type == true) {
            type = false;
            console.log('Requrl_i', Requrl_i);
            RequrlArray(Requrl_i, function () {
                Requrl_i += 1;
                type = true;
            });
        }
    }
}, 1000);