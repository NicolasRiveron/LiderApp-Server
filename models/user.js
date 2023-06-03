const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    email:{
        type: String,
        unique: true
    },
    password: String,
    isActive: Boolean,
    avatar: String,
    nextExercise: { type: Schema.Types.ObjectId, ref: 'Exercise' },
    statistics: Object,
    isAdmin: Boolean
})

module.exports = mongoose.model("User", UserSchema);