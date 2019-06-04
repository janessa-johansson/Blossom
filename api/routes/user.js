dotify = require('node-dotify');

get = (req, res, next) => {
    var query;
    if (req.query.name) {
        query = req.models.User.findOne({ "user.name": req.query.name })
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
        user: {
            email: req.body.user.email,
            name: req.body.user.name,
            address: {
                street: req.body.user.address.street,
                zipcode: req.body.user.address.zipcode,
                city: req.body.user.address.city,
            }
        }
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
    req.models.User.findByIdAndDelete(req.params.id).then((deleted) => {
        if (deleted)
            return res.send(deleted).status(200);
        res.sendStatus(204);
    }).catch((error) => next(error));
}

put = (req, res, next) => {
    req.models.User.updateOne({ _id: req.params.id },
        {
            user: {
                email: req.body.user.email,
                name: req.body.user.name,
                address: {
                    street: req.body.user.address.street,
                    zipcode: req.body.user.address.zipcode,
                    city: req.body.user.address.city,
                }
            },
        }, {
            new: true,
            upsert: true,
            runvalidators: true,

        }).then((status) => {
            console.log("status: ", status)
            if (status.upserted)
                res.status(201)
            else if (status.nModified)
                res.status(200)
            else
                res.status(204)
            res.send()
        }).catch((error) => next(error))
}

module.exports = {
    get,
    post,
    getById,
    deleteById,
    put,
}