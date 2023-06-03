const mongoose = require('mongoose');
const { Schema } = mongoose;

const ExerciseSchema = mongoose.Schema({
    title: String,
    order: Number,
    module: { type: Schema.Types.ObjectId, ref: 'Module' },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
})

module.exports = mongoose.model("Exercise", ExerciseSchema);