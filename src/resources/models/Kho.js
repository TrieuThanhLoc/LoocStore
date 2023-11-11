const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Kho = new Schema({
    masp: {type: String, unique: false},
    tensp: String,
    mausac: String,
    soluongtrongkho: Number,
    soluongdaban: {tyoe: Number},
    giaban: Number,
});

module.exports = mongoose.model('Kho', Kho);