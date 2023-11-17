const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Pin = new Schema({
    masp: {type: String, slug: "name", unique: true},
    dungluongpin: String,
    congnghepin: String,
});

module.exports = mongoose.model('Pin', Pin);