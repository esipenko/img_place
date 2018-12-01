const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const FileSchema = new Schema({
  user: {
     type: mongoose.Schema.Types.ObjectId, ref: 'User'
   },
  fileName: {
      type: String,
      required: true
    },
  size: {
      type: String,
      required: true
    },
  description: {
    type: String,
    maxlength: 400
  },
  path: {
      type: String,
      required: true
    }
});

module.exports = mongoose.model('File', FileSchema);
