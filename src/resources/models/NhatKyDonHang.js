const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NhatKyDonHang = new Schema ({
    madh : String,
    ngaytiepnhan: String,
    ngayvanchuyen: String,
    ngaygiaohang: String,
    ngayhoanthanh: String,
    ngayhuyhang: String,
    ngaygiaohangkhongthanhcong: String,
})
module.exports =  mongoose.model('NhatKyDonHang', NhatKyDonHang);