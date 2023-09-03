const Router = require('express')
const router = new Router()
const controller = require('./authController')
const { check } = require("express-validator")
const authMiddleware = require('./middlewaree/authMiddleware')
const roleMiddleware = require('./middlewaree/roleMiddleware')


router.post('/registration', [
  check("username", "User name cannot be empty").notEmpty(),
  check("password", "Password must to be longer then 4 but shorter 10 symbols").isLength({ min: 4, max: 10 }),
], controller.registration)
router.post('/login', controller.login)
router.get('/users', roleMiddleware(["ADMIN"]), controller.getUsers)

module.exports = router