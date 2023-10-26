const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KhachHang = new Schema({
    tenkh: String,
    makh: {type: String, slug: "", unique: true},
    anhkh: {type: String, default: 'noavatar.jpg'},
    matkhaukh: String,
    emailkh: String,
    ngaysinh: String,
    sodtkh: {type: Number, minLength:10, maxLength:12},
    createdAt:{type: Date, default: Date.now},
    updatedAt:{type: Date, default: Date.now},
},
    {tinmestamps: true}
);
module.exports = mongoose.model('KhachHang', KhachHang);