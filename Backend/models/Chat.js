import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  files: [{
    filename: String,
    filepath: String,
    mimetype: String,
    size: Number
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'New Chat'
  },
  messages: [messageSchema],
  model: {
    type: String,
    default: 'gemini-2.5-flash'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-generate title from first message
chatSchema.pre('save', function(next) {
  if (this.messages.length > 0 && this.title === 'New Chat') {
    const firstMessage = this.messages[0].content;
    this.title = firstMessage.substring(0, 50) + (firstMessage.length > 50 ? '...' : '');
  }
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Chat', chatSchema);
