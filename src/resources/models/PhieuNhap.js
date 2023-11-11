const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhieuNhap = new Schema({
    masp: {type: Object},
    tensp: {type: Object},
    mausac: {type: Object},
    soluongsp: {type: Object},
    gianhapsp: {type: Object},
    manv: String,
    ngaynhaphang: String,
    tongtiennhaphang: Number,
});

module.exports = mongoose.model('PhieuNhap', PhieuNhap);