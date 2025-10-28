import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Chat from '../models/Chat.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|txt|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images, PDFs, and documents are allowed'));
  }
});

// ✅ Initialize Google AI INSIDE the route handler, not here!
// This ensures process.env.GOOGLE_API_KEY is loaded

// @route   POST /api/chat
// @desc    Send message to AI
// @access  Private
router.post('/', protect, upload.array('files', 5), async (req, res) => {
  try {
    const { message, chatId } = req.body;
    const userId = req.user._id;

    // Validate API key exists
    if (!process.env.GOOGLE_API_KEY) {
      console.error('❌ GOOGLE_API_KEY is not set in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error: API key not found'
      });
    }

    // ✅ INITIALIZE HERE - Inside the handler when env vars are ready
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    let chat;

    // Find or create chat
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, userId });
      if (!chat) {
        return res.status(404).json({ 
          success: false, 
          message: 'Chat not found' 
        });
      }
    } else {
      chat = await Chat.create({
        userId,
        messages: [],
        model: 'gemini-2.5-flash'
      });
    }

    // Validate message
    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty'
      });
    }

    // Handle file uploads
    const uploadedFiles = req.files?.map(file => ({
      filename: file.originalname,
      filepath: file.path,
      mimetype: file.mimetype,
      size: file.size
    })) || [];

    // Add user message to chat
    chat.messages.push({
      role: 'user',
      content: message,
      files: uploadedFiles
    });

    // Build conversation history for context
    const conversationHistory = chat.messages
      .slice(0, -1) // Exclude last user message
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

    // Generate AI response
    const chatSession = model.startChat({
      history: conversationHistory,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
      },
    });

    const result = await chatSession.sendMessage(message);
    const aiResponse = result.response.text();

    // Add AI response to chat
    chat.messages.push({
      role: 'assistant',
      content: aiResponse
    });

    await chat.save();

    res.status(200).json({
      success: true,
      data: {
        chatId: chat._id,
        message: aiResponse,
        title: chat.title
      }
    });

  } catch (error) {
    console.error('❌ Chat Error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to generate response'
    });
  }
});

// @route   GET /api/chat/history
// @desc    Get all chats for user
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id })
      .select('title createdAt updatedAt')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: chats.length,
      data: chats
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// @route   GET /api/chat/:id
// @desc    Get single chat
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const chat = await Chat.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!chat) {
      return res.status(404).json({ 
        success: false, 
        message: 'Chat not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: chat
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// @route   DELETE /api/chat/:id
// @desc    Delete chat
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!chat) {
      return res.status(404).json({ 
        success: false, 
        message: 'Chat not found' 
      });
    }

    // Delete uploaded files
    chat.messages.forEach(msg => {
      msg.files?.forEach(file => {
        if (fs.existsSync(file.filepath)) {
          fs.unlinkSync(file.filepath);
        }
      });
    });

    res.status(200).json({
      success: true,
      message: 'Chat deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

export default router;
