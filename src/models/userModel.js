const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  age: String,
  email: String,
  address: String,
  image:String,
});

const UserModel = mongoose.model("crud-operation", userSchema);

const userAddressSchema = new mongoose.Schema({
  first_name :{ type: String, required: true }, 
  last_name :{ type: String, required: true }, 
  address: { type: String, required: true },
  phone_no: { type: String, required: true },
  user_id : { type: String }
});
const UserAddressModel = mongoose.model('UserAddress', userAddressSchema);


module.exports = {UserModel ,UserAddressModel};

