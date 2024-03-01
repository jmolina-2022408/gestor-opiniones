import express from 'express'
import { validateJwt } from '../middlewares/validate-jwt.js';
import { test, register, login, editProfile } from './user.controller.js';

const api = express.Router();

//RUTAS PÚBLICAS
api.post('/register', register)
api.post('/login', login)

//RUTAS PRIVADAS (solo usuarios logeados)
//Middleware
api.get('/test', [validateJwt], test)
api.put('/editProfile/:id', [validateJwt], editProfile) //Middleware -> funciones intermedias que sirven para validar.

export default api