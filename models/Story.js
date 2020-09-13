const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const StorySchema = new Schema({
  title: {
    type: String,
    required:true
  },
  content: {
    type:String,
    required:true
  },
  totalViews: [String],
  currentViews: {
    type:Number,
    default:  0
  },
  date: {
      type:String,
  }
});
module.exports = Story = mongoose.model("stories", StorySchema);
