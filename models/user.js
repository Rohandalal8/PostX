const mongoose = require('mongoose');
const { type } = require('os');

mongoose.connect("mongodb://localhost:27017/post");

const userSchema = mongoose.Schema({
    profilepic: {
        type: String,
        default: "default.png"
    },
    username: String,
    name: String,
    age: Number,
    email: String,
    password: String,
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }]
});

module.exports = mongoose.model('user', userSchema);