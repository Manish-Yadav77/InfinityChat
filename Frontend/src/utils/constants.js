export const API_BASE_URL = 'http://localhost:5000/api';

export const MODELS = {
  GEMINI: 'gemini-2.5-flash',
  GROQ: 'llama-3.3-70b'
};

export const ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant'
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
