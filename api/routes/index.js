const express = require('express');
const router = express.Router();

const user = require('./user.js');

router.use(function timelog (req, res, next) {
  console.log('Time:', Date.now())
  next();
})

router.get('/users', user.get);
router.post('/users', user.post);
router.get("/users/:id", user.getById)
router.put("/users/:id", user.put)
router.delete("/users/:id", user.deleteById)


module.exports = router;