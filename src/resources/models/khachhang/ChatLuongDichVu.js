const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatLuongDichVu = new Schema ({
    makh: String,
    sosao: Number,
    noidungdanhgia: String,
    ngaydanhgia: String,
    
})
module.exports =  mongoose.model('ChatLuongDichVu', ChatLuongDichVu);