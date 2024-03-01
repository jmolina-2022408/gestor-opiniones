import express from 'express'
import { validateJwt } from '../middlewares/validate-jwt.js';
import { createComment, deleteComment, editComment, test } from './comment.controller.js';

const api = express.Router();

//RUTAS PRIVADAS (solo usuarios logeados)
//Middleware
api.get('/test', [validateJwt], test)
api.post('/createComment', [validateJwt], createComment) //Middleware -> funciones intermedias que sirven para validar.
api.put('/editComment/:id', [validateJwt], editComment)
api.delete('/deleteComment/:id', [validateJwt], deleteComment)

export default api