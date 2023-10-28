const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GioHang = new Schema ({
    masp : String,
    makh : String,
    mausac: String,
    tensp : String,
    hangsx : String,
    giaban : Number,
    anh : String,
    soluongsp : Number,
    ngaythemvaogio: String,
})
module.exports =  mongoose.model('GioHang', GioHang);