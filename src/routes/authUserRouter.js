import express from 'express'
import { login, register } from '../controllers/authController.js'
import { loginschema, registerSchema, validate } from '../validator/validations.js'

const authUserRouter = express.Router()

authUserRouter.post('/register',validate(registerSchema),register)
authUserRouter.post('/login',validate(loginschema),login)

export default authUserRouter