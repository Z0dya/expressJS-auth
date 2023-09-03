const User = require('./models/User')
const Role = require('./models/Role')
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const { secret } = require('./config');
const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles
  }
  return jwt.sign(payload, secret, { expiresIn: "24h" })
}

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Error while registration', errors })
      }
      const { username, password } = req.body
      const candidate = await User.findOne({ username }) // ищем юзера с текущим юзернеймом
      if (candidate) { //если нашли (существует), то отклоняем, говорим что такое имя уже есть
        return res.status(400).json({ message: 'user already exists' })
      }
      const hashPass = bcrypt.hashSync(password, 7); // настройка хэша пароля
      const userRole = await Role.findOne({ value: 'USER' }) // нашли роль
      const user = new User({ username, password: hashPass, roles: [userRole.value] }) // создали юзера
      await user.save() // сохранили
      return res.json({ message: "user registration succsesfull" }) // отдали ответ
    }
    catch (e) {
      console.error(e, "error controller registration")
      res.status(400).json({ message: "Registration error" })
    }
  }
  async login(req, res) {
    try {
      const { username, password } = req.body
      const user = await User.findOne({ username })
      if (!user) {
        return res.status(400).json({ message: `User ${username} not found` })
      }
      const validPassword = bcrypt.compareSync(password, user.password)
      if (!validPassword) {
        return res.status(400).json({ message: 'Wrong password' })
      }
      const token = generateAccessToken(user._id, user.roles)
      return res.json({ token: token })
    }
    catch (e) {
      console.error(e, "error controller login ")
      res.status(400).json({ message: "Login error" })
    }
  }
  async getUsers(req, res) {
    try {
      //* код для начального создания 2 ролей
      // const userRole = new Role()
      // const adminRole = new Role({ value: 'ADMIN' })
      // await userRole.save()
      // await adminRole.save()
      // res.json('server work')
      const users = await User.find()
      res.json(users)
    }
    catch (e) {
      console.error(e, "error controller getusers ")
      res.status(400).json({ message: " Users error" })
    }
  }
}

module.exports = new authController()