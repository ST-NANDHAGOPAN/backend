const mongoose = require('mongoose');

const adminRegisterSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    password_confirmation :{ type: String }
});
const AdminRegisterModel = mongoose.model('AdminRegister', adminRegisterSchema);

const userRegisterSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    password_confirmation :{ type: String }
});
const UserRegisterModel = mongoose.model('UserRegister', userRegisterSchema);


module.exports = {AdminRegisterModel ,UserRegisterModel};