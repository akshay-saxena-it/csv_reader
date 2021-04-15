const express = require('express')
const router = express.Router();
const controller = require('../controller/index');


router.get('/', function (req, res) {
    res.send('<h1>Welcome, Server is running!</h1>')
})

router.get('/upload/csv', controller.uploadCsv)
router.get('/data', controller.getData)
router.post('/create', controller.create)


module.exports = router
