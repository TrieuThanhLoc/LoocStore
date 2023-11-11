const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DanhGia = new Schema ({
    masp : String,
    makh : String,
    sosao: Number,
    noidungdanhgia: String,
    ngaydanhgia: String,
})
module.exports =  mongoose.model('DanhGia', DanhGia);