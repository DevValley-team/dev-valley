export default () => ({
  app: {
    host: process.env.HOST || "localhost",
    port: parseInt(process.env.PORT, 10) || 3000,
    clientUrl: process.env.CLIENT_URL || ['*', "http://localhost:3000"],
    jwtSecret: process.env.JWT_SECRET || 'secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  database: {

  },
  mailer: {
    transport: {
      host: process.env.MAILER_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.MAILER_PORT, 10) || 587,
      secure: process.env.MAILER_SECURE || false,
      auth: {
        user: process.env.MAILER_USERNAME,
        pass: process.env.MAILER_PASSWORD
      }
    }
  }
});