const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThanhToan = new Schema ({
    madh : String,
    tongTienDonHang: Number,
    magiaodich: String,
    trangthaigiaodich: String,
    ngaythanhtoan: String,

    vnp_banktranno: String,
    vnp_cardtype: String,
    vnp_paydata: String,
    vnp_bankcode: String,
    vnp_responsecode: String,
    vnp_tmncode :String,
    vnp_securehash: String,

   
})
module.exports =  mongoose.model('ThanhToan', ThanhToan);