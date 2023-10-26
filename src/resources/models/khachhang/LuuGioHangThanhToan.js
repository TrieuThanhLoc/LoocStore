const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LuuTamGioHangThanhToan = new Schema ({
    makh : String,
    giohang: Object,
    tongtien: Number,
    giamgia: Number,
    tongtienthanhtoan: Number,
})
module.exports =  mongoose.model('LuuTamGioHangThanhToan', LuuTamGioHangThanhToan);