const mongoose = require('mongoose');
const { Schema } = mongoose;

const QuestionSchema = mongoose.Schema({
    data: Object,
    order: Number,
    exercise: { type: Schema.Types.ObjectId, ref: 'Exercise' },
    answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }]
})

module.exports = mongoose.model("Question", QuestionSchema);