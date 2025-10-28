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

router.post('/', protect, upload.array('files', 5), async (req, res) => {
  try {
    const { message, chatId } = req.body;
    const userId = req.user._id;

    if (!process.env.GOOGLE_API_KEY) {
      console.error('❌ GOOGLE_API_KEY missing');
      return res.status(500).json({ success: false, message: 'Server configuration error' });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Retrieve or create chat
    let chat = chatId
      ? await Chat.findOne({ _id: chatId, userId })
      : await Chat.create({ userId, messages: [], model: 'gemini-2.5-flash' });

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    // Save uploaded files if any
    const uploadedFiles = req.files?.map(file => ({
      filename: file.originalname,
      filepath: file.path,
      mimetype: file.mimetype,
      size: file.size
    })) || [];

    chat.messages.push({ role: 'user', content: message, files: uploadedFiles });

    // Dynamic response sizing
    const lowerMsg = message.toLowerCase();
    let maxTokens = 1024;
    if (lowerMsg.includes('explain') || lowerMsg.includes('roadmap') || lowerMsg.includes('detailed'))
      maxTokens = 2048;
    if (lowerMsg.includes('series') || lowerMsg.includes('step-by-step') || lowerMsg.includes('complete'))
      maxTokens = 3072;

    // ✅ Correctly formatted system instruction
    const systemInstruction = {
      role: "system",
      parts: [
        {
          text: `
You are InfinityChat, a professional AI assistant.
Respond fully, naturally, and proportionally to the question's depth.

Guidelines:
- If question is short/simple, reply briefly (3–6 lines).
- If user requests an explanation or roadmap, give 4–8 organized paragraphs.
- If question involves steps or tutorials, use clear numbered steps.
- Always end with a closing summary sentence.
- Avoid cutting off mid-sentence or repeating ideas.
- Never exceed the needed detail unless user asks for more.
          `
        }
      ]
    };

    const history = chat.messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Generate AI response
    const chatSession = model.startChat({
      history,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: maxTokens,
      },
      systemInstruction
    });

    const result = await chatSession.sendMessage(message);
    const aiResponse = result.response.text();

    chat.messages.push({ role: 'assistant', content: aiResponse });
    await chat.save();

    res.status(200).json({
      success: true,
      data: { chatId: chat._id, message: aiResponse, title: chat.title }
    });
  } catch (error) {
    console.error('❌ Chat Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate response'
    });
  }
});

// Fetch chat history
router.get('/history', protect, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id })
      .select('title createdAt updatedAt')
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, count: chats.length, data: chats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get a specific chat
router.get('/:id', protect, async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user._id });
    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });

    res.status(200).json({ success: true, data: chat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a chat
router.delete('/:id', protect, async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });

    // Delete uploaded files
    chat.messages.forEach(msg => {
      msg.files?.forEach(file => {
        if (fs.existsSync(file.filepath)) {
          fs.unlinkSync(file.filepath);
        }
      });
    });

    res.status(200).json({ success: true, message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
