const mongoose = require('mongoose');
const User = require('./user.js');

const uri = process.env.DATABASE_URL || "mongodb://localhost:27017/users"

const connectDb = () => {
    return mongoose.connect(uri, {useFindAndModify: false});
}

mongoose.set('useNewUrlParser', true)
mongoose.set('useCreateIndex', true)

module.exports = {
    connectDb,
    models: {
        User
    }
}