const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoXuLy = new Schema({
    masp: {type: String, slug: "name", unique: true},
    cpu: String,
    loaicpu: String,
    sonhan: Number,
});

module.exports = mongoose.model('BoXuLy', BoXuLy);