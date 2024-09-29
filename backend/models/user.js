const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    required: true,
    type: String,
    trim: true,
  },
  email: {
    required: true,
    type: String,
    trim: true,
    validate: {
      validator: (value) => {
        const re =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return value.match(re);
      },
      message: "Please enter a valid email address",
    },
  },
  aadhar:{
    type: String,
    trim: true,
    validate: {
      validator: (value) => {
        const re =
          /^\d{12}$/;
        return value.match(re);
      },
      message: "Please enter a valid aadhar number",
    },
  },
  password: {
    required: true,
    type: String,
  },
  userType: {
    required: true,
    type: String,
    default: "user"
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;