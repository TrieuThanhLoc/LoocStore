// Bien doi object de sua loi bao mat cua mongoose 4.6 +

module.exports = {
    multipleMongooseToObject: function(mongooseArrays){
        return mongooseArrays.map(mongoose => mongoose.toObject());
    },
    MongooseToObject: function(mongoose){
        return mongoose ? mongoose.toObject() : mongoose;
    }
}