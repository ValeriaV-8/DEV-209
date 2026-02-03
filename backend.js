const express = require('express');
const crypto = require('crypto');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors({
  // Allow all origins
  origin: '*',
  // Allow following methods
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  // Allow following headers
  allowedHeaders: ['Content-Type', 'Authorization'],
  // Enable credentials
  credentials: true,
  // How long the results of a preflight request can be cached
  maxAge: 86400 // 24 hours
}));

app.use(express.json());

// In-memory storage
const users = {};
const todos = {};

// Extract token from Authorization header
const extractToken = (authHeader) => {
  if (!authHeader) return null;
  return authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7) 
    : authHeader;
};

// Find user by token
const findUserByToken = (token) => 

  Object.values(users).find(u => u.token === token);

// Middleware for authentication
const authenticateUser = (req, res, next) => {
  const token = extractToken(req.headers.authorization);
  
  if (!token || !findUserByToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};

// Register user
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  
  if (users[username]) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  users[username] = { 
    username, 
    password, 
    token,
    id: Object.keys(users).length + 1
  };

  todos[username] = [];

  res.status(201).json({ 
    id: users[username].id, 
    username, 
    token 
  });
});

// Login user
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({ 
    id: user.id, 
    username, 
    token: user.token 
  });
});

// Logout user (clear token)
app.post('/logout', authenticateUser, (req, res) => {
  const token = extractToken(req.headers.authorization);
  const user = findUserByToken(token);

  if (user) {
    // Generate a new token to invalidate the old one
    user.token = crypto.randomBytes(32).toString('hex');
    res.json({ message: 'Logged out successfully' });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Create todo
app.post('/todos', authenticateUser, (req, res) => {
  const token = extractToken(req.headers.authorization);
  const user = findUserByToken(token);
  const { title, description } = req.body;

  const newTodo = {
    id: crypto.randomBytes(16).toString('hex'),
    title,
    description,
    completed: false,
    createdAt: new Date().toISOString()
  };

  todos[user.username].push(newTodo);
  res.status(201).json(newTodo);
});

// Get all todos
app.get('/todos', authenticateUser, (req, res) => {
  const token = extractToken(req.headers.authorization);
  const user = findUserByToken(token);
  res.json(todos[user.username]);
});

// Update todo
app.put('/todos/:id', authenticateUser, (req, res) => {
  const token = extractToken(req.headers.authorization);
  const user = findUserByToken(token);
  const todoId = req.params.id;
  const { title, description, completed } = req.body;

  const todoToUpdate = todos[user.username].find(todo => todo.id === todoId);
  
  if (!todoToUpdate) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  todoToUpdate.title = title || todoToUpdate.title;
  todoToUpdate.description = description || todoToUpdate.description;
  todoToUpdate.completed = completed !== undefined ? completed : todoToUpdate.completed;

  res.json(todoToUpdate);
});

// Delete todo
app.delete('/todos/:id', authenticateUser, (req, res) => {
  const token = extractToken(req.headers.authorization);
  const user = findUserByToken(token);
  const todoId = req.params.id;

  const todoIndex = todos[user.username].findIndex(todo => todo.id === todoId);
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  todos[user.username].splice(todoIndex, 1);
  res.status(204).send();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});