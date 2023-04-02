export default () => ({
  app: {
    host: process.env.HOST || "localhost",
    port: parseInt(process.env.PORT, 10) || 3000,
    clientUrl: process.env.CLIENT_URL || ["*", "http://localhost:3000"],
    jwtSecret: process.env.JWT_SECRET
  },
});