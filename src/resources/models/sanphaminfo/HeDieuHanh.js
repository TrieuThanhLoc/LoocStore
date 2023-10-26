const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HeDieuHanh = new Schema({
    masp: {type: String, slug: "name", unique: true},
    os: String,
    phienban: String,
});

module.exports = mongoose.model('HeDieuHanh', HeDieuHanh);