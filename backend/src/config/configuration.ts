export default () => ({
  app: {
    endpoint: process.env.ENDPOINT || "http://localhost:3000",
    frontendUrl: process.env.FRONTEND_URL || "http://192.168.0.236:3000",
    host: process.env.HOST || "localhost",
    port: parseInt(process.env.PORT, 10) || 3000,
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  database: {

  },
  mailer: {
    from: 'Dev Valley <>',
    transport: {
      host: process.env.MAILER_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.MAILER_PORT, 10) || 587,
      secure: process.env.MAILER_SECURE || false,
      auth: {
        user: process.env.MAILER_USERNAME || '',
        pass: process.env.MAILER_PASSWORD || ''
      }
    }
  }
});