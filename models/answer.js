const mongoose = require('mongoose');
const { Schema } = mongoose;

const AnswerSchema = mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    module: { type: Schema.Types.ObjectId, ref: 'Module' },
    exercise: { type: Schema.Types.ObjectId, ref: 'Exercise' },
    question: { type: Schema.Types.ObjectId, ref: 'Question' },
    data: Object
})

module.exports = mongoose.model("Answer", AnswerSchema);