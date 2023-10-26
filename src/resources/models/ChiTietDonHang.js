const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChiTietDonHang = new Schema ({
    masp : String,
    madh : String,
    soluongdat : Number,
    mausacdat: String,
})
module.exports =  mongoose.model('ChiTietDonHang', ChiTietDonHang);