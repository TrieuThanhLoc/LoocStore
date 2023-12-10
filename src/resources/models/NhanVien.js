const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NhanVien = new Schema({
    tennv: String,
    manv: {type: String, slug: "", unique: true},
    chucvu: String,
    matkhaunv: String,
    emailnv: String,
    gioitinh: String,
    ngaysinh: String,
    diachinv: String,
    sodtnv: Number,
    ngayvao: String,
    vohieuhoa: Boolean,
    anhnv:{type: String, default: 'noavatar.jpg'},
    createdAt:{type: Date, default: Date.now},
    updatedAt:{type: Date, default: Date.now},
},
    {tinmestamps: true}
);
module.exports = mongoose.model('NhanVien', NhanVien);