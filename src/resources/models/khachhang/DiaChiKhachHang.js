const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DiaChiKhachHang = new Schema ({
    makh : String,
    diachicuthe: String,
    phuongxa: String,
    quanhuyen: String,
    tinhtp: String,
})
module.exports =  mongoose.model('DiaChiKhachHang', DiaChiKhachHang);