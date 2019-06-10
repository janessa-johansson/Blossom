dotify = require('node-dotify');

get = (req, res, next) => {
    var query;
    if (req.query.name) {
        query = req.models.User.findOne({ "username": req.query.name })
    }
    else {
        query = req.models.User.find()
    }

    query.exec().then((user) => {
        return res.send(user);
    }).catch((error) => next(error))
}

post = (req, res, next) => {
    req.models.User.create({

        name: req.body.name,
        username: req.body.username,
        password: req.body.password

    }).then((user) => {
        return res.status(201).send(user);
    }).catch((error) => {
        next(error);
    })
}

getById = (req, res, next) => {
    req.models.User.findById(req.params.id).then((user) => {
        return res.send(user);
    }).catch((error) => next(error))
}

deleteById = (req, res, next) => {
    req.models.User.findOneAndDelete(req.params.id).then((deleted) => {
        if (deleted)
            return res.send(deleted).status(200);
        res.sendStatus(204);
    }).catch((error) => next(error));
}

put = (req, res, next) => {
    req.models.User.findOneAndUpdate({ _id: req.params.id },
        {
            name: req.body.name,
            username: req.body.username,
            password: req.body.password

        }, {
            new: true,
            upsert: true,
            runvalidators: true,

        }, (err, doc) => {
            if (err) {
                console.log("Unable to update.")
            } else {
                res.send(doc).status(200);
            }
            
        }).catch((error) => next(error))
}

module.exports = {
    get,
    post,
    getById,
    deleteById,
    put,
}