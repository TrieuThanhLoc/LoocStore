const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DonHang = new Schema ({
    makh : String,
    sodtkh: String,
    tenkh: String,
    gioitinh: String,
    diachigiaohang : String,
    phuongthucthanhtoan: String,
    tongtien: String,
    giamgia: String,
    tienthanhtoan: String,

    trangthai : String, 
    manvduyetdon : String,

    ngaydathang : String,

    yeucauhuydon : Boolean,

    danhgia : {type: Boolean, default: false},
})
module.exports =  mongoose.model('DonHang', DonHang);