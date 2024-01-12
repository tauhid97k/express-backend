const express = require('express')
const router = express.Router()
const testController = require('../controllers/testController')

router.get('/get', testController.getTest)
router.post('/create', testController.createTest)
router.put('/update', testController.updateTest)
router.delete('/delete', testController.deleteTest)

module.exports = router
