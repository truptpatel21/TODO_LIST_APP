const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  task: { type: String, required: true },
  done: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  
});

const TodoModel = mongoose.model('Todo', TodoSchema);
module.exports = TodoModel;
