
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';

dotenv.config();

// Security Middleware
import { securityHeaders, errorHandler, securityLogger, sanitizeParams } from './middleware/security';
import { rateLimit, rateLimitConfigs } from './middleware/rateLimit';
import { getCsrfToken } from './middleware/csrf';

const app = express();
const httpServer = createServer(app);

// Support multiple origins (comma-separated FRONTEND_URL)
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5175')
  .split(',')
  .map((o: string) => o.trim());

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Route imports
import authRoutes from './routes/auth.routes';
import gameRoutes from './routes/game.routes';
import aiRoutes from './routes/ai.routes';
import certificateRoutes from './routes/certificate.routes';
import partnerRoutes from './routes/partner.routes';
import friendRoutes from './routes/friend.routes';
import challengeRoutes from './routes/challenge.routes';
import studyGroupRoutes from './routes/studygroup.routes';
import heartsRoutes from './routes/hearts.routes';

// ============================================
// SECURITY MIDDLEWARE STACK
// ============================================

// CORS with secure options
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-XSRF-TOKEN']
}));

// Security headers (helmet alternative)
app.use(securityHeaders);

// Cookie parser for CSRF
app.use(cookieParser());

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security logging
app.use(securityLogger);

// Sanitize URL parameters
app.use(sanitizeParams);

// Global rate limiting (100 req/min)
app.use(rateLimit(rateLimitConfigs.api));

// ============================================
// CSRF TOKEN ENDPOINT
// ============================================
app.get('/api/csrf-token', getCsrfToken);

// ============================================
// ROUTES
// ============================================

// Auth routes with strict rate limiting
app.use('/api/auth', rateLimit(rateLimitConfigs.auth), authRoutes);

// Other routes
app.use('/api/game', gameRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/study-groups', studyGroupRoutes);
app.use('/api/hearts', heartsRoutes);

// Health Check
app.get('/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// ============================================
// ERROR HANDLING
// ============================================
app.use(errorHandler);

// 404 Handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// ============================================
// SOCKET.IO
// ============================================
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔒 Security middleware enabled`);
});
