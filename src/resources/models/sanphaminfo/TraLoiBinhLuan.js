const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TraLoiBinhLuan = new Schema({
    mabl: String,
    makh: String,
    noidungtraloi: String,
    ngaytraloi: String,
});

module.exports = mongoose.model('TraLoiBinhLuan', TraLoiBinhLuan);