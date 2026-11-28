import express, {type Request, type Response, type NextFunction} from 'express';
import http from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';

function parseAllowedOrigins(): Set<string> {
  const defaults = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://localhost',
    'http://localhost',
    'capacitor://localhost',
    'https://ariyanpal1008.github.io',
  ];

  const appUrl = (process.env.APP_URL || '').trim();
  if (appUrl) {
    try {
      defaults.push(new URL(appUrl).origin);
    } catch {
      // Ignore malformed APP_URL
    }
  }

  const extra = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  return new Set([...defaults, ...extra]);
}

function isOriginAllowed(origin: string | undefined, allowlist: Set<string>): boolean {
  if (!origin) return true;
  if (allowlist.has(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+\.github\.io$/i.test(origin)) return true;
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) return true;
  return false;
}

export function createApp() {
  const app = express();
  const allowedOrigins = parseAllowedOrigins();

  app.use(express.json({limit: '2mb'}));

  // CORS middleware covering Web, PWA, GitHub Pages & Capacitor Android APK origins
  app.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    if (origin && isOriginAllowed(origin, allowedOrigins)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    next();
  });

  // Health probe for Render/hosting (zero external AI dependencies or secrets)
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      ok: true,
      service: 'quadra12-web',
      version: '3.1',
      mode: 'deterministic-local-exam-engine',
      timestamp: new Date().toISOString(),
    });
  });

  // Reject any unknown /api/* route cleanly as JSON
  app.use('/api', (_req: Request, res: Response) => {
    res.status(404).json({
      error: 'API route not found. Quadra 12 v3.1 runs deterministic exam grading locally.',
    });
  });

  return app;
}

async function startServer() {
  const app = createApp();
  const httpServer = http.createServer(app);

  if (!isProduction) {
    const {createServer: createViteServer} = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        ws: {server: httpServer},
        allowedHosts: true,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(
      `[quadra12-web] v3.1 running on http://0.0.0.0:${PORT} (${isProduction ? 'production' : 'development'})`,
    );
  });
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(__filename)
) {
  void startServer();
}
