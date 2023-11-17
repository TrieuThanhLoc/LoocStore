const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SanPhamCu = new Schema({
    masp: {type: String, unique: true},
    giaban: Number,
    tinhtrangmay: Number,
    createdAt:{type: Date, default: Date.now},
    updatedAt:{type: Date, default: Date.now},
},
    {tinmestamps: true}
);
module.exports = mongoose.model('SanPhamCu', SanPhamCu);