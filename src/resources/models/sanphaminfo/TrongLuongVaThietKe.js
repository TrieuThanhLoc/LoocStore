const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrongLuongVaThietKe = new Schema({
    masp: {type: String, slug: "name", unique: true},
    kichthuoc: String,
    trongluong: String,
    khangnuoc: String,
    chatlieu: String,
    mausac: String,
});

module.exports = mongoose.model('TrongLuongVaThietKe', TrongLuongVaThietKe);