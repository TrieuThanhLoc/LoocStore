const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Camera = new Schema({
    masp: {type: String, slug: "name", unique: true},
    camtruoc: String,
    tinhnangcamtruoc: String,
    quayphimcamtruoc: String,
    camgocrong: String,
    camgocsieurong: String,
    cammacro: String,
    tinhnangcamsau: String,
    quayphimcamsau: String,
});

module.exports = mongoose.model('Camera', Camera);