/* eslint-disable no-extend-native */
String.prototype.toPersianDigits = function () {
    let id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return this.replace(/[0-9]/g, function (w) {
        return id[+w]
    });
};

String.prototype.toEnglishDigits = function () {
    return this.replace(/[۰-۹]/g, function (chr) {
        var persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return persian.indexOf(chr);
    });
};

String.prototype.toAmount = function(){
    let val = this.toString().toEnglishDigits();
    return parseInt(val.replace(/[^0-9]/ig,''));
};

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};