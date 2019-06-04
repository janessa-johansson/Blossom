const express = require('express');
const router = express.Router();

const user = require('./user.js');
const methods = require('./methods.js');

router.use(function timelog (req, res, next) {
  console.log('Time:', Date.now())
  next();
})

router.get('/users', user.get);
router.post('/users', user.post);
router.get("/users/:id", user.getById)
router.put("/users/:id", user.put)
router.delete("/users/:id", user.deleteById)

router.get('/methods', methods.get);
router.post('/methods', methods.post);
router.put('/methods', methods.put);
router.delete('/methods', methods.delete);

module.exports = router;