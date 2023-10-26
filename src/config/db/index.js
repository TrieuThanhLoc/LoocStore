const mongoose = require('mongoose');

async function connect(){
    try {
         await mongoose.connect('mongodb://127.0.0.1:27017/looc_store',{

         });
         console.log("Connect to database successfull !")
    } catch (error) {
         console.log("Connect to database falure !")
    }
}

module.exports = { connect };
