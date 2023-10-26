const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Kho = new Schema({
    masp: {type: String, unique: false},
    mamau: String,
    mausac: String,
    soluong: Number,
    soluongdaban: {tyoe: Number},
    rom: Number,
    ram: Number,
    giaban: Number,
});

module.exports = mongoose.model('Kho', Kho);