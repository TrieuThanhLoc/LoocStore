const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ManHinh = new Schema({
    masp: {type: String, slug: "name", unique: true},
    tyledientichmanhinh: String,
    kichthuocmanhinh: Number,
    maumanhinh: String,
    loaicamung: String,
    tylekhunghinh: String,
    congnghemanhinh: String,
    chuanmanhinh: String,
    dophangiai: String,
    tansoquet: Number,
    kichthuocmanhinhphu: String,
});

module.exports = mongoose.model('ManHinh', ManHinh);