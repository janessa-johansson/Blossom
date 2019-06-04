mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user: {
        email: String,
        name: String,
        address: {
            street: String,
            zipcode: String,
            city: String,
        }
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
