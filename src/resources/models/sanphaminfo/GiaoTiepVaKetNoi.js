const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GiaoTiepVaKetNoi = new Schema({
    masp: {type: String, slug: "name", unique: true},
    baomat: String,
    sosim: Number,
    loaisim: String,
    hotromang: String,
    conggiaotiep: String,
    wifi: String,
    gps: String,
    ketnoikhac: String,
});

module.exports = mongoose.model('GiaoTiepVaKetNoi', GiaoTiepVaKetNoi);