const mongoose = require('mongoose');
const { Schema } = mongoose;

const ModuleSchema = mongoose.Schema({
    title:{
        type: String,
        unique: true
    },
    order: Number,
    mailExpert: String,
    exercises: [{ type: Schema.Types.ObjectId, ref: 'Exercise' }]
})

module.exports = mongoose.model("Module", ModuleSchema);