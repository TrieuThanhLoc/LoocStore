const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BinhLuan = new Schema({
    masp: String,
    makh: String,
    noidungbinhluan: String,
    ngaybinhluan: String,
});

module.exports = mongoose.model('BinhLuan', BinhLuan);