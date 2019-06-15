mongoose = require('mongoose');

const listSchema = new mongoose.Schema({

    username: String,
    list:
        {
            title: String,
            item: Array
        }

});

const List = mongoose.model('List', listSchema);

module.exports = List;
