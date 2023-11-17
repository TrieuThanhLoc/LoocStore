const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NganHangLienKet = new Schema ({
    makh : String,
    manh: String,
    sothe: Number,
    tenchuthe: String,
    ngayphathang: String,
    ngaylienket: String,
})
module.exports =  mongoose.model('NganHangLienKet', NganHangLienKet);