import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        minLength: [8, 'Password must be 8 characters'],
        required: true
    }
}, {
    versionKey: false
})

//pre mongoose
//pluralizar
export default mongoose.model('user', userSchema)