const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LichSuTimKiem = new Schema({
    makh: String,
    noidungtimkiem: String,
    ngaytimkiem: String,
},
    {tinmestamps: true}
);
module.exports = mongoose.model('LichSuTimKiem', LichSuTimKiem);