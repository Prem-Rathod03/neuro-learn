import http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { activities, badges, computeStars, modules } from './data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');
const DEFAULT_PORT = 4000;

const ensureDataFiles = () => {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify([]));
  if (!fs.existsSync(PROGRESS_FILE)) fs.writeFileSync(PROGRESS_FILE, JSON.stringify([]));
};

const readJson = (filePath, fallback) => {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const writeJson = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const parseBody = req =>
  new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
  });

const sendJson = (res, status, payload) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  });
  res.end(JSON.stringify(payload));
};

const generateToken = userId => {
  return Buffer.from(`${userId}:${Date.now()}:${crypto.randomBytes(6).toString('hex')}`).toString('base64');
};

const getSafeUser = user => {
  const { password, ...rest } = user;
  return rest;
};

ensureDataFiles();

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url || '', true);
  const { pathname, query } = parsedUrl;

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    });
    return res.end();
  }

  if (pathname === '/health') {
    return sendJson(res, 200, { status: 'ok', uptime: process.uptime() });
  }

  if (pathname === '/api/modules' && req.method === 'GET') {
    return sendJson(res, 200, { modules });
  }

  if (pathname === '/api/activities' && req.method === 'GET') {
    const moduleId = query.moduleId;
    const filtered = moduleId ? activities.filter(a => a.moduleId === moduleId) : activities;
    return sendJson(res, 200, { activities: filtered });
  }

  if (pathname && pathname.startsWith('/api/modules/') && pathname.endsWith('/activities') && req.method === 'GET') {
    const moduleId = pathname.split('/')[3];
    const filtered = activities.filter(a => a.moduleId === moduleId);
    return sendJson(res, 200, { activities: filtered });
  }

  if (pathname === '/api/badges' && req.method === 'GET') {
    return sendJson(res, 200, { badges, totalStars: computeStars() });
  }

  if (pathname === '/api/auth/register' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const { name, email, password, neurodiversityTags = [], age } = body;
      if (!name || !email || !password) {
        return sendJson(res, 400, { error: 'name, email, and password are required' });
      }

      const users = readJson(USERS_FILE, []);
      if (users.find(u => u.email === email)) {
        return sendJson(res, 409, { error: 'User already exists' });
      }

      const newUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        password,
        neurodiversityTags,
        age,
        type: 'student',
      };

      users.push(newUser);
      writeJson(USERS_FILE, users);

      const token = generateToken(newUser.id);
      return sendJson(res, 201, { token, user: getSafeUser(newUser) });
    } catch (err) {
      return sendJson(res, 400, { error: 'Invalid JSON', details: err.message });
    }
  }

  if (pathname === '/api/auth/login' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const { email, password } = body;
      const users = readJson(USERS_FILE, []);
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        return sendJson(res, 401, { error: 'Invalid credentials' });
      }

      const token = generateToken(user.id);
      return sendJson(res, 200, { token, user: getSafeUser(user) });
    } catch (err) {
      return sendJson(res, 400, { error: 'Invalid JSON', details: err.message });
    }
  }

  if (pathname === '/api/progress' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const { userId, moduleId, activityId, status = 'completed' } = body;
      if (!userId || !moduleId || !activityId) {
        return sendJson(res, 400, { error: 'userId, moduleId, and activityId are required' });
      }

      const progressEntries = readJson(PROGRESS_FILE, []);
      let entry = progressEntries.find(p => p.userId === userId);
      if (!entry) {
        entry = { userId, completions: [] };
        progressEntries.push(entry);
      }

      const existing = entry.completions.find(c => c.activityId === activityId);
      if (existing) {
        existing.status = status;
        existing.updatedAt = new Date().toISOString();
      } else {
        entry.completions.push({
          moduleId,
          activityId,
          status,
          updatedAt: new Date().toISOString(),
        });
      }

      writeJson(PROGRESS_FILE, progressEntries);
      return sendJson(res, 200, { progress: entry });
    } catch (err) {
      return sendJson(res, 400, { error: 'Invalid JSON', details: err.message });
    }
  }

  if (pathname && pathname.startsWith('/api/progress/') && req.method === 'GET') {
    const userId = pathname.split('/')[3];
    const progressEntries = readJson(PROGRESS_FILE, []);
    const entry = progressEntries.find(p => p.userId === userId);
    return sendJson(res, 200, { progress: entry || { userId, completions: [] } });
  }

  sendJson(res, 404, { error: 'Route not found' });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : DEFAULT_PORT;
server.listen(PORT, () => {
  console.log(`Neuro Learn backend listening on http://localhost:${PORT}`);
});



