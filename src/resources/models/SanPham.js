const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SanPham = new Schema({
    tensp: String,
    masp: {type: String, slug: "name", unique: true},
    giagoc: Number,
    giaban: Number,
    anh: String,
    loaisp: String,
    soluong: Number,
    hangsx: String,
    createdAt:{type: Date, default: Date.now},
    updatedAt:{type: Date, default: Date.now},
},
    {tinmestamps: true}
);
module.exports = mongoose.model('SanPham', SanPham);