const express = require('express');
const router = express.Router();

const user = require('./user.js');
const list = require('./list.js');

router.use(function timelog (req, res, next) {
  console.log('Time:', Date.now())
  next();
})

router.get('/users', user.get);
router.post('/users', user.post);
router.get("/users/:id", user.getById)
router.put("/users/:id", user.put)
router.delete("/users/:id", user.deleteById)

router.get('/lists', list.get);
router.post('/lists', list.post);
router.get("/lists/:id", list.getById)
router.put("/lists/:id", list.put)
router.delete("/lists/:id", list.deleteById)


module.exports = router;