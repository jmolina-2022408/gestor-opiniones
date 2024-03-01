import User from './user.model.js';
import { encrypt, checkPassword } from '../utils/validator.js';
import { generateJwt } from '../utils/jwt.js';

export const test = (req, res) => {
    console.log('test is running')
    return res.send({ message: 'Test is running' })
}

// Registro de Usuario
export const register = async (req, res) => {
    try {
        let data = req.body;

        // Verificar si el nombre de usuario o el correo electrónico ya existen
        let user = await User.findOne({ $or: [{ email: data.email, username: data.username }] });
        if (user) {
            return res.status(400).send({ message: 'Username or email already exists' });
        }

        // Crear un nuevo usuario
        data.password = await encrypt(data.password);
        user = new User(data);
        await user.save();

        return res.status(201).send({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error registering user' });
    }
};

// Inicio de Sesión
export const login = async (req, res) => {
    try {
        let data = req.body;

        // Buscar al usuario por nombre de usuario o correo electrónico
        let user = await User.findOne({ $or: [{ username: data.username }, { email: data.email }] });
        if (user && await checkPassword(data.password, user.password)) {
            let loggedUser = {
                uid: user._id,
                username: user.username,
                email: user.email
            }
            //Generar el Token
            let token = await generateJwt(loggedUser)
            //Respondo al usuario
            return res.send(
                {
                    message: `Welcome ${loggedUser.username}`,
                    loggedUser,
                    token
                }
            )
        }
        return res.status(401).send({ message: 'Invalid credentials' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error logging in' });
    }
};

// Edición de Perfil
export const editProfile = async (req, res) => {
    try {
        let { id } = req.params;
        let { username, email, currentPassword, newPassword } = req.body;

        // Verificar si el usuario existe
        let user = await User.findById(id);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Verificar la contraseña actual antes de permitir el cambio
        if (!(await checkPassword(currentPassword, user.password))) {
            return res.status(401).send({ message: 'Incorrect current password' });
        }

        // Actualizar nombre de usuario y/o correo electrónico si se proporcionan
        if (username) user.username = username;
        if (email) user.email = email;

        // Cambiar la contraseña si se proporciona una nueva contraseña
        if (newPassword) {
            newPassword = await encrypt(newPassword);
            user.password = newPassword;
        }

        await user.save();

        return res.send({ message: 'User profile updated successfully', user });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating user profile' });
    }
};