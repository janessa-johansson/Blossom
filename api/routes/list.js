dotify = require('node-dotify');

get = (req, res, next) => {
    var query;
    if (req.query.username) {
        query = req.models.List.find({ username: req.query.username })
    }
    else {
        query = req.models.List.find()
    }

    query.exec().then((list) => {
        return res.send(list);
    }).catch((error) => next(error))
}

post = (req, res, next) => {
    req.models.List.create({

        username: req.body.username,
        list:
        {
            title: req.body.list.title,
            item: req.body.list.item
        }


    }).then((list) => {
        return res.status(201).send(list);
    }).catch((error) => {
        next(error);
    })
}

getById = (req, res, next) => {
    req.models.List.findById(req.params.id).then((list) => {
        return res.send(list);
    }).catch((error) => next(error))
}

deleteById = (req, res, next) => {
    req.models.List.findByIdAndDelete({ _id: req.params.id }).then((deleted) => {
        if (deleted)
            return res.send(deleted).status(200);
        res.sendStatus(204);
    }).catch((error) => next(error));
}

put = (req, res, next) => {
    req.models.List.findOneAndUpdate({ _id: req.params.id },
        {
            username: req.body.username,
            list:
            {
                title: req.body.list.title,
                item: req.body.list.item
            }

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