const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LuuTru = new Schema({
    masp: {type: String, slug: "name", unique: true},
    ram: Number,
    loairam: String,
    rom: Number,
    thenhongoai: String,
});

module.exports = mongoose.model('LuuTru', LuuTru);