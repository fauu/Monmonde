"use strict";
exports.__esModule = true;
exports.randomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
exports.randomElement = function (array) {
    return array[exports.randomInt(0, array.length - 1)];
};
