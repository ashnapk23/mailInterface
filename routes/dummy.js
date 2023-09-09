const express=require('express')
const router =express.Router()
const dummyController= require('../controllers/dummyController')

router.post('/',dummyController.handleNewUser)


module.exports=router